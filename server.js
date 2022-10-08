var express = require("express");
const bodyParser = require("body-parser");
//To Call Google
const {
  GoogleAdsApi,
  services,
  resources,
  enums,
  ResourceNames,
  customer,
} = require("google-ads-api");

require("dotenv").config();
const cors = require("cors");

const path = require("path");

const { OAuth2Client } = require("google-auth-library");

const app = express();
const port = process.env.PORT || 5000;

var refreshToken;
var accessToken;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});
//.env
const auth = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL // server redirect url handler
);

//New Ads Api Client
const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_CLIENT_ID,
  client_secret: process.env.GOOGLE_CLIENT_SECRET,
  developer_token: process.env.DEVELOPER_TOKEN,
});

const fetch = require("node-fetch");

//Sign In Button
app.post("/auth", (req, res) => {
  const url = auth.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/adwords"],
    prompt: "consent",
  });
  res.send({ url }); //Google Auth Url
});

//After Account Is Selected Send Access and Refresh Back
app.get("/auth/google-callback", async (req, res) => {
  // get code from url
  const code = req.query.code;

  const r = await auth.getToken(code);

  accessToken = r.tokens.access_token;
  refreshToken = r.tokens.refresh_token;
  auth.setCredentials({
    refresh_token: r.tokens,
  });
  res.redirect(`/?accessToken=${accessToken}&refreshToken=${refreshToken}`);
});

//Maps The Front End State Into Conversion Actions [] For Google Service
async function parseConversions(sheetData) {
  const configdata = sheetData.config;
  const webdata = sheetData.websiteConversions;
  const phonedata = sheetData.phoneConversions;
  const config = {
    customer_id: configdata.cid,
    login_customer_id: configdata.mcc,
  };

  //Website On Page Conversions
  const webConversions = webdata.map((con) => {
    return new resources.ConversionAction({
      name: con.name,
      type: con.type,
      category: con.category,
      value_settings: {
        default_value: parseInt(con.value_settings),
      },
      counting_type: con.counting_type,
      attribution_model_settings: {
        attribution_model: con.attribution_model_settings,
      },
      click_through_lookback_window_days: parseInt(
        con.click_through_lookback_window_days
      ),
      view_through_lookback_window_days: parseInt(
        con.view_through_lookback_window_days
      ),
      primary_for_goal: con.primary_for_goal,
    });
  });

  //Phone Call Conversions
  const phoneConversions = phonedata.map((con) => {
    return new resources.ConversionAction({
      name: con.name,
      type: con.type,
      category: "PHONE_CALL_LEAD",
      value_settings: {
        default_value: parseInt(con.value_settings),
      },
      counting_type: con.counting_type,
      attribution_model_settings: {
        attribution_model: con.attribution_model_settings,
      },
      phone_call_duration_seconds: parseInt(con.phone_call_duration_seconds),
      click_through_lookback_window_days: parseInt(
        con.click_through_lookback_window_days
      ),
      // view_through_lookback_window_days: con.view_through_lookback_window_days,
    });
  });

  return [...phoneConversions, ...webConversions];

  // return new services.MutateConversionActionsRequest({
  //   customer_id: config.customer_id,
  //   operations: [...phoneConversions, ...webConversions],
  // });
}

//Submit Button
app.post("/api/request", async (req, res) => {
  var refreshToken = req.body.refresh;
  var sheetData = req.body.sheetData;

  //Individual Customer Under Mcc
  const cust = client.Customer({
    customer_id: sheetData.config.cid,
    login_customer_id: sheetData.config.mcc,
    refresh_token: refreshToken,
  });

  const allconversions = await parseConversions(sheetData);

  //Returns Googles Response To Front End
  await cust.conversionActions
    .create(allconversions, "partial_failure")
    .then((r) => {
      res.json(r.results);
    })
    .catch((err) => {
      res.status(400).send(err.errors);
    });
});

app.get("/", function (request, response) {
  response.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});

app.use(express.static(path.resolve("./client/dist")));

app.listen(port, function () {
  console.log("Express server listening on port " + port);
});

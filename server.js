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

const { google } = require("googleapis");

const app = express();

const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//.env
const oauth2Client = new google.auth.OAuth2(
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
app.post("/auth", cors(), (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/adwords"],
    prompt: "select_account",
  });
  res.send({ url }); //Google Auth Url
});

//After Account Is Selected Send Access and Refresh Back
app.get("/auth/google-callback?", (req, res) => {
  // get code from url
  const code = req.query.code;
  // get access token
  oauth2Client.getToken(code, (err, tokens) => {
    if (err) {
      console.log("server 38 | error", err);
      throw new Error("Issue with Login", err.message);
    }

    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token;
    res.redirect(
      `http://localhost:3000?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  });
});

//gets refresh token
app.post("/auth/getValidToken", async (req, res) => {
  try {
    const request = await fetch("https://www.googleapis.com/oauth2/v4/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: req.body.refreshToken,
        grant_type: "refresh_token",
      }),
    });

    const data = await request.json();

    res.json({
      accessToken: data.access_token,
    });
  } catch (error) {
    res.json({ error: error.message });
  }
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
      value_settings: { default_value: con.value_settings },
      counting_type: con.counting_type,
      attribution_model_settings: {
        attribution_model: con.attribution_model_settings,
      },
      click_through_lookback_window_days:
        con.click_through_lookback_window_days,
      // view_through_lookback_window_days: con.view_through_lookback_window_days,
      primary_for_goal: con.primary_for_goal,
    });
  });

  //Phone Call Conversions
  const phoneConversions = phonedata.map((con) => {
    return new resources.ConversionAction({
      name: con.name,
      type: con.type,
      category: con.category,
      value_settings: { default_value: con.value_settings },
      counting_type: con.counting_type,
      attribution_model_settings: {
        attribution_model: con.attribution_model_settings,
      },
      click_through_lookback_window_days:
        con.click_through_lookback_window_days,
      view_through_lookback_window_days: con.view_through_lookback_window_days,
      primary_for_goal: con.primary_for_goal,
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
  let googResponse = await cust.conversionActions
    .create(allconversions)
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
  res.json(googResponse);
});

app.listen(port, function () {
  console.log("Express server listening on port " + port);
});

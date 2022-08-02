import React, { SyntheticEvent, FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useThunkDispatch } from "./redux/store";
import { callAPI } from "./redux/apiSlice"

import logo from "./logo.svg";
import "./css/App.css";

import Auth from "./Auth";
import Parse from "./Parse";
import MyDataTable from "./MyDataTable";

const App: FC = () => {
  const dispatch = useThunkDispatch();

  const hasSheetData = useSelector((state: RootState) => {
    return state.dashboard.hasSheetData;
  });

  const isLoggedIn = useSelector((state: RootState) => {
    return state.dashboard.isLoggedIn;
  });

  const sheetData = useSelector((state: RootState) => {
    return state.dashboard.sheetData;
  });

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const payload = Object.assign(
      {},
      {
        url: "/api/request",
        method: "post",
        data: {
          refresh: sessionStorage.refreshToken,
          sheetData
        },
      }
    );
    try {
      dispatch(callAPI(payload));

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Auth />
      {isLoggedIn && (
        <div>
          <Parse />
          {hasSheetData && <MyDataTable />}
          <div className="Submit"><button
            className={"btn-secondary"}
            style={{ marginLeft: 8 }}
            onClick={(e) => handleSubmit(e)}
          >
            Submit
          </button></div>
        </div>
      )}
    </div>
  );
};

export default App;

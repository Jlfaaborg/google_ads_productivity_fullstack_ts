import React, { SyntheticEvent, FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { useThunkDispatch, useAppDispatch } from "./redux/store";
import { callAPI } from "./redux/apiSlice"

import logo from "./logo.svg";
import "./css/App.css";

import Auth from "./Auth";
import Parse from "./Parse";
import MyDataTable from "./MyDataTable";
import Results from "./Results";

const App: FC = () => {
  const thunk = useThunkDispatch();
  const dispatch = useAppDispatch();

  const hasSheetData = useSelector((state: RootState) => {
    return state.dashboard.hasSheetData;
  });

  const showResults = useSelector((state: RootState) => {
    return state.api.showResults;
  });

  const isPending = useSelector((state: RootState) => {
    return state.api.loading === "pending";
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
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    try {
      thunk(callAPI(payload));

    } catch (err) {
      console.error(err);
    }
  };

  const handleReupload = (e: DragEvent) => {
    e.preventDefault();
    dispatch({ type: "dashboard/handleReupload" });
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Auth />
      {(isLoggedIn && !isPending) && (
        <div>
          {!hasSheetData && <Parse />}
          {(hasSheetData && !showResults) &&
            (<div>
              <MyDataTable />
              <div className="Submit">
                <button
                  className={"btn-secondary"}
                  style={{ marginLeft: 8 }}
                  onClick={(e) => handleSubmit(e)}
                >
                  Submit
                </button>
                <button
                  className={"btn-secondary"}
                  style={{ marginLeft: 8 }}
                  onClick={(e) => handleReupload(e)}
                >
                  Reupload
                </button>
              </div>
            </div>)}
          {showResults && <Results />}
        </div>
      )}
      {isPending && (
        <div>
          <h1>Pending</h1>
        </div>
      )}
    </div>
  );
};

export default App;

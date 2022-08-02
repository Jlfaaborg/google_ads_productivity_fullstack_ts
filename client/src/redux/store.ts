import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import logger from "redux-logger";


import dashboardReducer from "./dashboardSlice";
import apiReducer from "./apiSlice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    api: apiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend([logger])
});

export type RootState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch<typeof store.dispatch>()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useThunkDispatch = () => useDispatch<any>()


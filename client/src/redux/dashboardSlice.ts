import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit"
import { SyntheticEvent } from "react";



interface InitialState {
  sheetData: SheetData,
  tempdata: SheetData,
  isLoggedIn: boolean,
  hasTokens: boolean,
  hasSheetData: boolean,
  showSheetData: boolean,
}

interface PhoneConversions {
  attribution_model_settings: string,
  click_through_lookback_window_days: number,
  counting_type: string,
  name: string,
  phone_call_duration_seconds: number,
  primary_for_goal: boolean,
  type: string,
  view_through_lookback_window_days: number,
  value_settings: number
}

interface ChangePayload {
  conversionToChange: string,
  e: SyntheticEvent,
  index: number,
  newValue: string,
  target: string
}

interface WebSiteConversions {
  attribution_model_settings: string,
  category: string,
  click_through_lookback_window_days: number,
  counting_type: string,
  name: string,
  primary_for_goal: boolean,
  type: string,
  view_through_lookback_window_days: number,
  value_settings: number
}

interface SheetData {
  config: {
    "customID": string,
    "managerID": string,
  },
  phoneConversions: PhoneConversions[],
  websiteConversions: WebSiteConversions[],
}

const initialState: InitialState = {
  sheetData: {
    config: {
      "customID": "",
      "managerID": "",
    },
    phoneConversions: [],
    websiteConversions: [],
  },
  tempdata: {
    config: {
      "customID": "",
      "managerID": "",
    },
    phoneConversions: [],
    websiteConversions: [],
  },
  isLoggedIn: false,
  hasTokens: false,
  hasSheetData: false,
  showSheetData: false,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: initialState,
  reducers: {
    //Logged In Or Out
    logged: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    //Has Resresh Token
    setHasTokens: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
    },
    setSheetData: (state, action: PayloadAction<SheetData>) => {
      console.log(action)
      state.sheetData = state.tempdata = {
        config: action.payload.config,
        phoneConversions: action.payload.phoneConversions,
        websiteConversions: action.payload.websiteConversions,
      };
      state.hasSheetData = true;
    },
    showSheetData: (state, action: PayloadAction<boolean>) => {
      state.showSheetData = action.payload;
    },
    //Changes to datatable
    handleChange: (state, action: PayloadAction<ChangePayload>) => {
      switch (action.payload.conversionToChange) {
        case "phoneConversions":
          state.tempdata.phoneConversions[action.payload.index][
            action.payload.target
          ] = action.payload.newValue;
          console.log(state.tempdata);
          break;
        case "websiteConversions":
          state.tempdata.websiteConversions[action.payload.index][
            action.payload.target
          ] = action.payload.newValue;
          console.log(state.tempdata);
          break;
        default:
          break;
      }
    },
    handleSave: (state) => {
      console.log(state.tempdata)
      state.sheetData = state.tempdata;
    },
    handleReupload: (state) => {
      state.sheetData = initialState.sheetData;
      state.tempdata = initialState.tempdata;
      state.hasSheetData = false;
    },
  },
});

export const {
  logged,
  setSheetData,
  showSheetData,
  handleChange,
  handleSave,
  handleReupload,
  setHasTokens,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
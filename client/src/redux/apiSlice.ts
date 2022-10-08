/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

// import { SimpleRequest } from "api";

interface InitialState {
  dataFromBackend: any,
  loading: string,
  error: any,
  currentRequestId: string,
  showResults: boolean
  showPending: boolean,
  hasErrors: boolean,
  hasResults: boolean,
}

// type googleError =
//   { message: string; trigger: { string_value: string; }; }


const initialState: InitialState = {
  dataFromBackend: "",
  loading: "idle",
  error: {},
  currentRequestId: "",
  showResults: false,
  hasErrors: false,
  hasResults: false,
  showPending: false
};

const parseError = async (ePromise: Promise<any>) => {
  const err = await ePromise;
  if (Array.isArray(err)) {
    const errs = err.map(error => {
      const tentries = Object.entries(error.trigger);
      const t = Object.fromEntries(tentries);
      const trigger = JSON.stringify(t);
      let code = "UNKNOWN";

      const location = error.location.field_path_elements.map(l => l.field_name).join("--");
      if (error.error_code) {
        code = error.error_code.field_error
      }

      return ({
        code: code,
        message: error.message,
        trigger: trigger,
        locatation: location
      })

    });
    return errs;
  }
  for (const GoogleAdsError in err) {
    const errors = [];

    if (Object.prototype.hasOwnProperty.call(err, GoogleAdsError)) {
      const error = err[GoogleAdsError];
      let code = "";
      let trigger = "";

      switch (typeof error.error_code) {
        case "object": {
          const entries = Object.entries(error.code);
          const t = Object.fromEntries(entries);
          code = JSON.stringify(t);
          break;
        }
        case "string": {
          code = error.code;
          break;
        }
        default: code = "UNKNOWN";
      }

      switch (typeof error.trigger) {
        case "object": {
          const entries = Object.entries(error.trigger);
          const t = Object.fromEntries(entries);
          trigger = JSON.stringify(t);
          break;
        }
        case "string": {
          trigger = error.trigger;
          break;
        }
        default: trigger = "UNKNOWN";

      }
      const r = {
        code: code,
        message: error.message,
        trigger: trigger,
        locatation: error.location.field_path_elements.join("--")
      };
      errors.push(r);

    }
    return errors;

  }
}

const parseSuccess = async (rPromise: Promise<any>) => {
  const res = await rPromise;
  const response = [];
  res.forEach(el => {
    response.push(el)
  });
  return response;
}


//Calls Express to Call Google Ads Api
export const callAPI = createAsyncThunk(
  "api/request",
  async ({ url, method, data, headers }: any, { rejectWithValue }) => {
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const fail = await response.json();
      const message = await parseError(fail);
      return rejectWithValue(message)

    } else {
      const success = response.json();
      const parse = await parseSuccess(success);
      return parse;
    }
  }
);

const apiSlice = createSlice({
  name: "api",
  initialState: initialState,
  reducers: {
    show: (state, action: PayloadAction<boolean>) => {
      state.showResults = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(callAPI.pending, (state, action) => {
        if (state.loading === "idle") {
          state.loading = "pending";
          state.currentRequestId = action.meta.requestId;

        }
      })
      .addCase(callAPI.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        if (
          state.loading === "pending" &&
          state.currentRequestId === requestId
        ) {
          state.loading = "idle";
          state.dataFromBackend = action.payload;
          state.hasResults = true;
          state.showResults = true;

        }
      })
      .addCase(callAPI.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (
          state.loading === "pending" &&
          state.currentRequestId === requestId
        ) {
          state.loading = "idle";
          state.error = action.payload;
          state.currentRequestId = "";
          state.hasErrors = true;
          state.showResults = true;
        }
      })
  }
})

export default apiSlice.reducer;

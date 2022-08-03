/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, SerializedError, } from "@reduxjs/toolkit";
// import { SimpleRequest } from "api";


interface InitialState {
  dataFromBackend: any,
  loading: string,
  error: SerializedError,
  currentRequestId: string,
}

const initialState: InitialState = {
  dataFromBackend: "",
  loading: "idle",
  error: {},
  currentRequestId: "",
};

//Calls Express to Call Google Ads Api
export const callAPI = createAsyncThunk(
  "api/request",
  async ({ url, method, data, headers }: any, { rejectWithValue }) => {
    console.log({ url, method, data, headers });
    const request = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(data)
    });
    const response = await request.json().catch(err => {
      rejectWithValue(err)
    })

    return response

  }
);

const apiSlice = createSlice({
  name: "api",
  initialState: initialState,
  reducers: {},
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
          state.dataFromBackend = action;
        }
      })
      .addCase(callAPI.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (
          state.loading === "pending" &&
          state.currentRequestId === requestId
        ) {
          state.loading = "idle";
          state.error = action.error;
          state.currentRequestId = "";
        }
      });
  },
});

export default apiSlice.reducer;

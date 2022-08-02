export const load = (url: string, method: string, data: any, headers: any) => (dispatch) => {
  console.log(url, method, data, headers);
  dispatch(
    apiCallBegan({
      url,
      method,
      data: data,
      onStart: stateRequested.type,
      onSuccess: stateReceived.type,
      onError: stateFailed.type,
      headers,
    })
  );
};

import React from "react"
import { createRoot } from "react-dom/client";
import "./css/index.css";
import App from "./App";
// import * as serviceWorker from "./serviceWorker";
const container = document.getElementById("root");

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!); // createRoot(container!) if you use TypeScript

//React-Redux
import { store } from "./redux/store";

import { Provider } from "react-redux";
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider >
    </React.StrictMode>
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

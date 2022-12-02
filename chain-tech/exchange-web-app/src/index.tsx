import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { HashRouter } from "react-router-dom";
import Router from "./pages/routes/Router";
import "./index.css";
import "./i18n.ts";
import { AppProvider } from "./store/select-context";
ReactDOM.render(
  <AppProvider>
    <HashRouter>
      <Router />
    </HashRouter>
  </AppProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import App from "./components/App";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import * as React from "react";
import * as ReactDOM from "react-dom";
/* global document, Office, module, require */
import {
  BrowserRouter as Router
} from "react-router-dom";

initializeIcons();

let isOfficeInitialized = false;

const title = "Contoso Task Pane Add-in";

ReactDOM.render(
  <Router>
    <React.StrictMode>
        <App />
    </React.StrictMode>
  </Router>,
  document.getElementById("container")
);

//const render = (Component) => {
//};
//
///* Render application after Office initializes */
//Office.initialize = () => {
//  isOfficeInitialized = true;
//  render(App);
//};
//
///* Initial render showing a progress bar */
//render(App);
//
//if (module.hot) {
//  module.hot.accept("./components/App", () => {
//    const NextApp = require("./components/App").default;
//    render(NextApp);
//  });
//}

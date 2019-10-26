import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

import { waitForFonts } from "./helpers";

import "./index.css";

ReactDOM.render(<App />, document.getElementById("root"));

(async () => {
  const fonts = await waitForFonts();

  if (fonts.includes("Zoinks")) {
    document.documentElement.classList.add("Zoinks");
  }

  document.documentElement.classList.remove("loading");
})();

import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/roboto/latin-300.css";
import "@fontsource/roboto/latin-400.css";
import "@fontsource/roboto/latin-500.css";
import "@fontsource/roboto/latin-700.css";
import "./index.css";
import { cssVars } from "./theme";
import App from "./App";

for (const [name, value] of Object.entries(cssVars)) {
  document.documentElement.style.setProperty(name, value);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

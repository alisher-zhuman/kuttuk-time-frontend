import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";

import { ROUTER } from "@app/router";

import "./styles/index.css";
import "./configs/i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={ROUTER} />
  </StrictMode>,
);

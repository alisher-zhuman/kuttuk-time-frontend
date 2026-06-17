import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";

import { QueryClientProvider } from "@tanstack/react-query";

import { QUERY_CLIENT } from "@app/configs/query";
import { ROUTER } from "@app/router";

import "./styles/index.css";
import "./configs/i18n";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={QUERY_CLIENT}>
      <RouterProvider router={ROUTER} />
    </QueryClientProvider>
  </StrictMode>,
);

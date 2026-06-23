import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";

import { QueryClientProvider } from "@tanstack/react-query";

import { QUERY_CLIENT } from "@app/configs/query";
import { AuthProvider, ThemeProvider, TMAProvider } from "@app/providers";
import { ROUTER } from "@app/router";

import { applyTheme } from "@shared/helpers";
import { useThemeStore } from "@shared/store";

import "./styles/index.css";
import "./configs/i18n";

applyTheme(useThemeStore.getState());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TMAProvider>
        <AuthProvider>
          <QueryClientProvider client={QUERY_CLIENT}>
            <RouterProvider router={ROUTER} />
          </QueryClientProvider>
        </AuthProvider>
      </TMAProvider>
    </ThemeProvider>
  </StrictMode>,
);

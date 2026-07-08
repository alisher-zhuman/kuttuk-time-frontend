import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";

import { QueryClientProvider } from "@tanstack/react-query";

import { QUERY_CLIENT } from "@app/configs/query";
import {
  AuthProvider,
  ErrorBoundary,
  ThemeProvider,
  TMAProvider,
} from "@app/providers";
import { ROUTER } from "@app/router";

import { applyTheme } from "@shared/helpers";
import { useThemeStore } from "@shared/store";

import "./styles/index.css";
import "./configs/i18n";

applyTheme(useThemeStore.getState());

// eslint-disable-next-line react-refresh/only-export-components -- temporary, for testing ErrorBoundary
const Broken = () => {
  throw new Error("TEST: verifying ErrorBoundary");
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <Broken />
      <ThemeProvider>
        <TMAProvider>
          <AuthProvider>
            <QueryClientProvider client={QUERY_CLIENT}>
              <RouterProvider router={ROUTER} />
            </QueryClientProvider>
          </AuthProvider>
        </TMAProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);

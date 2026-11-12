import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";

import { QueryClientProvider } from "@tanstack/react-query";

import { QUERY_CLIENT } from "@app/configs/query";
import {
  AuthProvider,
  ErrorBoundary,
  ThemeProvider,
  TMAProvider
} from "@app/providers";
import { createAppRouter } from "@app/router";

import { applyTheme } from "@shared/helpers";
import { useThemeStore } from "@shared/store";

// Self-hosted (no render-blocking Google Fonts request); only the subsets a
// page uses (cyrillic, latin) are downloaded.
import "@fontsource-variable/manrope";
import "./styles/index.css";
import "./configs/i18n";

applyTheme(useThemeStore.getState());

const router = createAppRouter();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <TMAProvider>
          <AuthProvider>
            <QueryClientProvider client={QUERY_CLIENT}>
              <RouterProvider router={router} />
            </QueryClientProvider>
          </AuthProvider>
        </TMAProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>
);

import { type ReactElement, type ReactNode } from "react";
import { createMemoryRouter, RouterProvider } from "react-router";

import { I18nextProvider } from "react-i18next";

import { QueryClientProvider } from "@tanstack/react-query";
import { render, renderHook } from "@testing-library/react";
import { init } from "@tma.js/sdk-react";

import i18n from "@app/configs/i18n";
import { createQueryClient } from "@app/configs/query";

// Like TMAProvider: the SDK needs init() before any component calls it. The
// fake client (launch params + bridge) is installed in vitest.setup.
init();

interface Options {
  // The URL the component is rendered at.
  route?: string;
  // The pattern it matches — for a component reading useParams.
  path?: string;
  // Russian by default: the team reads ru; kg is asked for explicitly.
  language?: string;
}

const prepare = (language: string) => {
  void i18n.changeLanguage(language);

  // Fresh per test (no cache leaking between tests), the app's own settings.
  return createQueryClient();
};

// Renders inside every provider the app mounts.
export const renderWithProviders = (ui: ReactElement, options: Options = {}) => {
  const { route = "/", path = "*", language = "ru" } = options;

  const queryClient = prepare(language);
  const router = createMemoryRouter([{ path, element: ui }], { initialEntries: [route] });

  const result = render(
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </I18nextProvider>
  );

  return { ...result, router, queryClient };
};

// The same providers for a hook; no router (a hook that needs one renders
// something, and goes through renderWithProviders).
export const renderHookWithProviders = <T,>(hook: () => T, options: Options = {}) => {
  const queryClient = prepare(options.language ?? "ru");

  const wrapper = ({ children }: { children: ReactNode }) => (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </I18nextProvider>
  );

  return { ...renderHook(hook, { wrapper }), queryClient };
};

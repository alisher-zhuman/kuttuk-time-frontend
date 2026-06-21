import { retrieveLaunchParams } from "@tma.js/sdk-react";

import { DEFAULT_THEME, type Theme } from "@shared/constants";

export const detectTheme = (): Theme => {
  try {
    const params = retrieveLaunchParams();
    const scheme = params["tgWebAppColorScheme"];

    if (scheme === "dark" || scheme === "light") return scheme;
  } catch {
    // not in TMA
  }

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";

  return DEFAULT_THEME;
};

export const applyTheme = (state: { theme: Theme }) => {
  document.documentElement.setAttribute("data-theme", state.theme);
};

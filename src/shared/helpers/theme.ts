import { retrieveLaunchParams } from "@tma.js/sdk-react";

import { type Theme } from "@shared/constants";

export const detectTheme = (): "light" | "dark" => {
  try {
    const params = retrieveLaunchParams();
    const scheme = params["tgWebAppColorScheme"];

    if (scheme === "dark" || scheme === "light") return scheme;
  } catch {
    // not in TMA
  }

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";

  return "light";
};

export const applyTheme = (state: { theme: Theme }) => {
  const resolved = state.theme === "system" ? detectTheme() : state.theme;
  document.documentElement.setAttribute("data-theme", resolved);
};

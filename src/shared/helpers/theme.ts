import { type Theme } from "@shared/constants";

import { getLaunchParams } from "./tma";

export const detectTheme = (): "light" | "dark" => {
  const scheme = getLaunchParams()?.["tgWebAppColorScheme"];

  if (scheme === "dark" || scheme === "light") return scheme;

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";

  return "light";
};

export const applyTheme = (state: { theme: Theme }) => {
  const resolved = state.theme === "system" ? detectTheme() : state.theme;
  document.documentElement.setAttribute("data-theme", resolved);
};

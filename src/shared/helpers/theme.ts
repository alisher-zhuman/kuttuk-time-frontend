import { themeParams } from "@tma.js/sdk-react";

import { type Theme } from "@shared/constants";

import { getLaunchParams } from "./tma";

export const detectTheme = (): "light" | "dark" => {
  // Live Telegram theme, updated on theme_changed. Guarded by isMounted: before
  // mount bgColor is unset and isDark reports true regardless of the theme.
  // Not miniApp.isDark — that follows our own setBgColor, not Telegram's theme.
  if (themeParams.isMounted()) {
    return themeParams.isDark() ? "dark" : "light";
  }

  // Launch-time snapshot — only until themeParams mounts.
  const scheme = getLaunchParams()?.["tgWebAppColorScheme"];

  if (scheme === "dark" || scheme === "light") return scheme;

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";

  return "light";
};

export const applyTheme = (state: { theme: Theme }) => {
  const resolved = state.theme === "system" ? detectTheme() : state.theme;
  document.documentElement.setAttribute("data-theme", resolved);
};

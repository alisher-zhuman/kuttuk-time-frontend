export const THEME_STORAGE_KEY = "kuttuk-time-theme";
export const DEFAULT_THEME = "light" as const;
export const SUPPORTED_THEMES = ["light", "dark"] as const;
export type Theme = (typeof SUPPORTED_THEMES)[number];

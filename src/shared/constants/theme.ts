export const THEME_STORAGE_KEY = "kuttuk-time-theme";
export const SUPPORTED_THEMES = ["light", "dark", "system"] as const;
export type Theme = (typeof SUPPORTED_THEMES)[number];

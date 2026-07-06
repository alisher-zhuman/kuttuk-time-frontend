export const VIEW_MODE_STORAGE_KEY = "kuttuk-time-view-mode";
export const VIEW_MODES = ["user", "admin"] as const;
export type ViewMode = (typeof VIEW_MODES)[number];

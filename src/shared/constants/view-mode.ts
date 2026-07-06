export const VIEW_MODES = ["user", "admin"] as const;
export type ViewMode = (typeof VIEW_MODES)[number];

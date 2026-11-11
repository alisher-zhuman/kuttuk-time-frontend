import { create } from "zustand";

// telegram - opened inside Telegram (launch params present): the Mini App.
// web - a plain browser: the website, buyer screens only.
export type AppMode = "telegram" | "web";

export interface AppModeState {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
}

// Set once at start (TMAProvider: the SDK's init() succeeds only in Telegram).
export const useAppModeStore = create<AppModeState>((set) => ({
  mode: "telegram",
  setMode: (mode) => set({ mode })
}));

export const isWebsite = () => useAppModeStore.getState().mode === "web";

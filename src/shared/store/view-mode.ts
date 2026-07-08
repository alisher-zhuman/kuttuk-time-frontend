import { create } from "zustand";

import { type ViewMode } from "@shared/constants";

export interface ViewModeState {
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
}

export const useViewModeStore = create<ViewModeState>((set) => ({
  viewMode: "user",
  setViewMode: (viewMode) => set({ viewMode })
}));

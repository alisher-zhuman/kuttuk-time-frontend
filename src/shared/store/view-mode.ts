import { create } from "zustand";
import { persist } from "zustand/middleware";

import { VIEW_MODE_STORAGE_KEY,type ViewMode } from "@shared/constants";
import { getScopedStorageKey } from "@shared/helpers";

export interface ViewModeState {
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
}

export const useViewModeStore = create<ViewModeState>()(
  persist(
    (set) => ({
      viewMode: "user",
      setViewMode: (viewMode) => set({ viewMode }),
    }),
    { name: getScopedStorageKey(VIEW_MODE_STORAGE_KEY) },
  ),
);

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { type Theme, THEME_STORAGE_KEY } from "@shared/constants";
import { getScopedStorageKey } from "@shared/helpers";

export interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "system",
      setTheme: (theme) => set({ theme }),
    }),
    { name: getScopedStorageKey(THEME_STORAGE_KEY) },
  ),
);


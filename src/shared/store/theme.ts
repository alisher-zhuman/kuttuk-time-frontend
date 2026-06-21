import { create } from "zustand";
import { persist } from "zustand/middleware";

import { type Theme, THEME_STORAGE_KEY } from "@shared/constants";
import { applyTheme, detectTheme } from "@shared/helpers";

export interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: detectTheme(),
      setTheme: (theme) => set({ theme }),
    }),
    { name: THEME_STORAGE_KEY },
  ),
);

useThemeStore.subscribe(applyTheme);
applyTheme(useThemeStore.getState());

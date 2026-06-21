import { create } from "zustand";
import { persist } from "zustand/middleware";

import { type Theme, THEME_STORAGE_KEY } from "@app/constants";
import { applyTheme, detectTheme } from "@app/helpers";

export interface State {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<State>()(
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

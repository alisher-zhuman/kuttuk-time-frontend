import { type ReactNode, useEffect } from "react";

import {
  init,
  miniApp,
  swipeBehavior,
  themeParams,
  viewport,
} from "@tma.js/sdk-react";

import { AppNotFoundPage } from "@pages/app-not-found";

import { detectTheme } from "@shared/helpers";
import { useThemeStore } from "@shared/store";

const TMA_COLORS = {
  light: { header: "#FFFFFF", bg: "#F4F5F7" },
  dark: { header: "#161D2E", bg: "#0F1422" },
} as const;

let isTMA = true;

try {
  init();
} catch {
  isTMA = false;
}

interface Props {
  children: ReactNode;
}

export const TMAProvider = ({ children }: Props) => {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    if (themeParams.mount.isAvailable()) {
      themeParams.mount();
    }

    if (miniApp.mount.isAvailable()) {
      miniApp.mount();
    }

    if (swipeBehavior.mount.isAvailable()) {
      swipeBehavior.mount();
      swipeBehavior.disableVertical();
    }

    if (viewport.mount.isAvailable()) {
      void viewport.mount().then(() => {
        viewport.bindCssVars();

        if (viewport.requestFullscreen.isAvailable()) {
          void viewport.requestFullscreen();
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!miniApp.mount.isAvailable()) return;

    const resolved = theme === "system" ? detectTheme() : theme;
    const { header, bg } = TMA_COLORS[resolved];

    miniApp.setHeaderColor(header);
    miniApp.setBgColor(bg);

    if (miniApp.setBottomBarColor.isAvailable()) {
      miniApp.setBottomBarColor(bg);
    }
  }, [theme]);

  if (!isTMA) return <AppNotFoundPage />;

  return <>{children}</>;
};

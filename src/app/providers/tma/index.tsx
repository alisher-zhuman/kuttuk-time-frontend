import { type ReactNode, useEffect } from "react";

import {
  init,
  miniApp,
  swipeBehavior,
  themeParams,
  useSignal,
  viewport
} from "@tma.js/sdk-react";

import { AppNotFoundPage } from "@pages/app-not-found";

import { detectTheme } from "@shared/helpers";
import { useThemeStore } from "@shared/store";

const TMA_COLORS = {
  light: { header: "#FFFFFF", bg: "#F4F5F7" },
  dark: { header: "#161D2E", bg: "#0F1422" }
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

  const isTelegramDark = useSignal(themeParams.isDark);

  useEffect(() => {
    if (themeParams.mount.isAvailable()) {
      themeParams.mount();
    }

    if (miniApp.mount.isAvailable()) {
      miniApp.mount();
    }

    if (miniApp.ready.isAvailable()) {
      miniApp.ready();
    }

    if (swipeBehavior.mount.isAvailable()) {
      swipeBehavior.mount();
      swipeBehavior.disableVertical();
    }

    // StrictMode runs this effect twice in dev, and bindCssVars throws
    // CSSVarsBoundError on a second bind. The cancelled run's async .then must
    // do nothing, and cleanup unbinds what this run bound (viewport has no
    // unmount in sdk 3.3, so the mount itself is left alone).
    let isCancelled = false;
    let unbindViewportCssVars: VoidFunction | undefined;

    if (viewport.mount.isAvailable()) {
      void viewport.mount().then(() => {
        if (isCancelled) {
          return;
        }

        if (!viewport.isCssVarsBound()) {
          unbindViewportCssVars = viewport.bindCssVars();
        }

        if (viewport.requestFullscreen.isAvailable()) {
          void viewport.requestFullscreen();
        }
      });
    }

    return () => {
      isCancelled = true;
      unbindViewportCssVars?.();
    };
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
  }, [theme, isTelegramDark]);

  if (!isTMA) return <AppNotFoundPage />;

  return <>{children}</>;
};

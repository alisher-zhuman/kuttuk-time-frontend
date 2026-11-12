import { type ReactNode, useEffect } from "react";

import {
  init,
  miniApp,
  swipeBehavior,
  themeParams,
  useSignal,
  viewport
} from "@tma.js/sdk-react";

import { detectTheme, getLaunchParams } from "@shared/helpers";
import { useAppModeStore, useThemeStore } from "@shared/store";

const TMA_COLORS = {
  light: { header: "#FFFFFF", bg: "#F4F5F7" },
  dark: { header: "#161D2E", bg: "#0F1422" }
} as const;

// Outside Telegram init() throws - a plain browser: the website. Set before
// anything renders; the SDK's isAvailable() checks then just say false.
try {
  init();
} catch {
  useAppModeStore.getState().setMode("web");
  // For CSS: the website keeps the browser's own scroll and swipe gestures.
  document.documentElement.setAttribute("data-mode", "web");
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

        // Fullscreen is for phones; on desktop clients it would blow the
        // mini app up over the whole Telegram window.
        const platform = getLaunchParams()?.tgWebAppPlatform;

        if ((platform === "ios" || platform === "android") && viewport.requestFullscreen.isAvailable()) {
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

    // An RGB header color needs Mini Apps 6.10+; before that the call throws
    // and took the whole app down on old clients - skip it there.
    if (miniApp.setHeaderColor.isAvailable() && miniApp.setHeaderColor.supports("rgb")) {
      miniApp.setHeaderColor(header);
    }

    if (miniApp.setBgColor.isAvailable()) {
      miniApp.setBgColor(bg);
    }

    if (miniApp.setBottomBarColor.isAvailable()) {
      miniApp.setBottomBarColor(bg);
    }
  }, [theme, isTelegramDark]);

  return <>{children}</>;
};

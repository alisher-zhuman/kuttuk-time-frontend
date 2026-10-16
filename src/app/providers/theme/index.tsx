import { type ReactNode, useLayoutEffect } from "react";

import { themeParams, useSignal } from "@tma.js/sdk-react";

import { applyTheme } from "@shared/helpers";
import { useThemeStore } from "@shared/store";

interface Props {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  const theme = useThemeStore((s) => s.theme);

  // Subscribed only to re-run the effect when Telegram's theme changes.
  const isTelegramDark = useSignal(themeParams.isDark);

  // Layout effect: data-theme must be set before children's passive effects
  // (useMainButton) read the resolved CSS color vars.
  useLayoutEffect(() => {
    applyTheme({ theme });

    if (theme !== "system") return;

    const handleChange = () => applyTheme({ theme: "system" });

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", handleChange);

    return () => mq.removeEventListener("change", handleChange);
  }, [theme, isTelegramDark]);

  return <>{children}</>;
};

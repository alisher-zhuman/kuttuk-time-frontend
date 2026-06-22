import { type ReactNode, useEffect } from "react";

import { applyTheme } from "@shared/helpers";
import { useThemeStore } from "@shared/store";

interface Props {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    applyTheme({ theme });

    if (theme !== "system") return;

    const handleChange = () => applyTheme({ theme: "system" });

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", handleChange);

    return () => mq.removeEventListener("change", handleChange);
  }, [theme]);

  return <>{children}</>;
};

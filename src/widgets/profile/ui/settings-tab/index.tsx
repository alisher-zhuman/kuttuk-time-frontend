import { useTranslation } from "react-i18next";

import { Moon, Sun, SunMoon } from "lucide-react";

import { SUPPORTED_THEMES, type Theme } from "@shared/constants";
import { useThemeStore } from "@shared/store";
import { LangSwitcher, SegmentedControl } from "@shared/ui";

const THEME_ICONS: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: SunMoon,
};

export const SettingsTab = () => {
  const { t } = useTranslation();
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const themeItems = SUPPORTED_THEMES.map((th) => {
    const Icon = THEME_ICONS[th];
    return {
      value: th,
      label: (
        <span className="flex items-center gap-1.5">
          <Icon size={14} />
          {t(`theme.${th}`)}
        </span>
      ),
    };
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-(--color-slate) uppercase tracking-wider px-1">
          {t("language.label")}
        </span>
        <LangSwitcher variant="segmented" />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-(--color-slate) uppercase tracking-wider px-1">
          {t("theme.label")}
        </span>
        <SegmentedControl items={themeItems} value={theme} onChange={setTheme} />
      </div>
    </div>
  );
};

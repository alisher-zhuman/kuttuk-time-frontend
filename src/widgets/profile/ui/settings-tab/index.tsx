import { useTranslation } from "react-i18next";

import { SUPPORTED_THEMES } from "@shared/constants";
import { useThemeStore } from "@shared/store";
import { LangSwitcher, SegmentedControl } from "@shared/ui";

export const SettingsTab = () => {
  const { t } = useTranslation();
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  const themeItems = SUPPORTED_THEMES.map((th) => ({
    value: th,
    label: t(`theme.${th}`),
  }));

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

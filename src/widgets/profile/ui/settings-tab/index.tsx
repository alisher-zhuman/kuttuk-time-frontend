import { useTranslation } from "react-i18next";

import { LangSwitcher } from "@shared/ui";

export const SettingsTab = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold text-(--color-slate) uppercase tracking-wider px-1">
        {t("language.label")}
      </span>

      <LangSwitcher variant="segmented" />
    </div>
  );
};

import { useTranslation } from "react-i18next";

import { BOT_URL } from "@shared/constants";
import { Logo } from "@shared/ui";

export const AppNotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-6 bg-(--color-card) px-8 text-center">
      <div className="flex flex-col items-center gap-1">
        <Logo />
        <span className="text-sm text-(--color-hint)">{t("appNotFound.subtitle")}</span>
      </div>

      <p className="text-(--color-slate) text-base leading-relaxed max-w-xs">
        {t("appNotFound.description")}
      </p>

      <a
        href={BOT_URL}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-(--color-primary) text-(--color-card) font-semibold text-sm"
      >
        {t("appNotFound.openInTelegram")}
      </a>
    </div>
  );
};

import { useTranslation } from "react-i18next";

import { miniApp } from "@tma.js/sdk-react";

import { Logo } from "@shared/ui";

// Telegram never refreshes initData while the app stays open (or on a reload
// inside Telegram), and log-in rejects it after 24h — only a fresh launch
// from the bot gets new initData, so closing the app is the only fix.
export const SessionExpiredPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-6 bg-(--color-card) px-8 text-center">
      <Logo />

      <div className="flex flex-col items-center gap-2">
        <span className="text-xl font-extrabold tracking-tight text-(--color-ink)">
          {t("sessionExpired.title")}
        </span>

        <p className="text-(--color-slate) text-base leading-relaxed max-w-xs">
          {t("sessionExpired.description")}
        </p>
      </div>

      {miniApp.close.isAvailable() && (
        <button
          type="button"
          onClick={() => miniApp.close()}
          className="px-6 py-3 rounded-full bg-(--color-primary) text-(--color-card) font-semibold text-sm cursor-pointer"
        >
          {t("sessionExpired.close")}
        </button>
      )}
    </div>
  );
};

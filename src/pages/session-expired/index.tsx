import { useTranslation } from "react-i18next";

import { miniApp } from "@tma.js/sdk-react";

import { PillButton, StatusScreen } from "@shared/ui";

// Telegram never refreshes initData while the app stays open (or on a reload
// inside Telegram), and log-in rejects it after 24h — only a fresh launch
// from the bot gets new initData, so closing the app is the only fix.
export const SessionExpiredPage = () => {
  const { t } = useTranslation();

  return (
    <StatusScreen
      title={t("sessionExpired.title")}
      description={t("sessionExpired.description")}
      action={
        miniApp.close.isAvailable() && (
          <PillButton onClick={() => miniApp.close()}>{t("sessionExpired.close")}</PillButton>
        )
      }
    />
  );
};

import { useTranslation } from "react-i18next";

import { useAppModeStore, useAuthStore } from "@shared/store";

import { TelegramLoginButton } from "../telegram-login-button";

// The website's guest: «Войти через Telegram» - their purchases move to the
// Telegram account (the same certificates in the Mini App), the bot starts
// writing (receipts, expiry reminders). Nothing for a signed-in buyer or in
// the Mini App.
export const TelegramLoginPrompt = () => {
  const { t } = useTranslation();

  const isWeb = useAppModeStore((s) => s.mode === "web");
  const isGuest = useAuthStore((s) => s.isGuest);

  if (!isWeb || !isGuest) return null;

  return (
    <section className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-(--color-card) border border-(--color-line) text-center">
      <p className="text-sm text-(--color-slate) max-w-xs">{t("site.login.hint")}</p>
      <TelegramLoginButton />
    </section>
  );
};

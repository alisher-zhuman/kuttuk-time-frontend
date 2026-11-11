import { useTranslation } from "react-i18next";

import { useQueryClient } from "@tanstack/react-query";

import { logInWithTelegramWidget, type TelegramAuthData } from "@shared/api";
import { useGenericError } from "@shared/hooks";
import { useAppModeStore, useAuthStore } from "@shared/store";

import { TelegramLoginWidget } from "../telegram-login-widget";

// The website's guest: «Войти через Telegram» - their purchases move to the
// Telegram account (the same certificates in the Mini App), the bot starts
// writing (receipts, expiry reminders). Nothing for a signed-in buyer or in
// the Mini App.
export const TelegramLoginPrompt = () => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const showGenericError = useGenericError();

  const isWeb = useAppModeStore((s) => s.mode === "web");
  const isGuest = useAuthStore((s) => s.isGuest);

  if (!isWeb || !isGuest) return null;

  const handleAuth = async (authData: TelegramAuthData) => {
    try {
      const { accessToken, role } = await logInWithTelegramWidget(authData);

      // At once: the guest's JWT points at a user the merge just deleted.
      useAuthStore.getState().setAuth(accessToken, role, false);

      // Everything the guest had now lives under the Telegram account.
      void queryClient.invalidateQueries();
    } catch {
      showGenericError();
    }
  };

  return (
    <section className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-(--color-card) border border-(--color-line) text-center">
      <p className="text-sm text-(--color-slate) max-w-xs">{t("site.login.hint")}</p>
      <TelegramLoginWidget onAuth={(authData) => void handleAuth(authData)} />
    </section>
  );
};

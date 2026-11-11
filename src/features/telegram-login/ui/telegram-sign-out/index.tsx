import { useState } from "react";

import { useTranslation } from "react-i18next";

import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";

import { signOutOnWebsite } from "@shared/api";
import { useGenericError, usePopup } from "@shared/hooks";
import { useAppModeStore, useAuthStore } from "@shared/store";

const SIGN_OUT = "sign-out";

// The website, signed in with Telegram: who it is and «Выйти» - back to a
// quiet guest (browsing only). Nothing for a guest or in the Mini App.
export const TelegramSignOut = () => {
  const [isSigningOut, setIsSigningOut] = useState(false);

  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const showPopup = usePopup();

  const showGenericError = useGenericError();

  const isWeb = useAppModeStore((s) => s.mode === "web");
  const isGuest = useAuthStore((s) => s.isGuest);

  if (!isWeb || isGuest) return null;

  const handleSignOut = async () => {
    const choice = await showPopup({
      message: t("site.login.signOutConfirm"),
      buttons: [
        { id: SIGN_OUT, type: "destructive", text: t("site.login.signOut") },
        { type: "cancel" }
      ]
    });

    if (choice !== SIGN_OUT) return;

    setIsSigningOut(true);

    try {
      const { accessToken, role } = await signOutOnWebsite();

      useAuthStore.getState().setAuth(accessToken, role, true);

      // The account's certificates must not stay on screen.
      void queryClient.resetQueries();
    } catch {
      showGenericError();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <section className="flex flex-col gap-3 p-4 rounded-2xl bg-(--color-card) border border-(--color-line)">
      <span className="text-sm text-(--color-slate)">{t("site.login.signedIn")}</span>
      <button
        type="button"
        disabled={isSigningOut}
        onClick={() => void handleSignOut()}
        className="flex items-center gap-2 self-start text-sm font-bold text-(--color-accent) cursor-pointer disabled:opacity-50"
      >
        <LogOut size={18} />
        {t("site.login.signOut")}
      </button>
    </section>
  );
};

import { useState } from "react";

import { useTranslation } from "react-i18next";

import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";

import { signOutOnWebsite } from "@shared/api";
import { useGenericError, usePopup } from "@shared/hooks";
import { useAppModeStore, useAuthStore } from "@shared/store";

const SIGN_OUT = "sign-out";

// The website, signed in with Telegram: «Выйти» - back to a quiet guest
// (browsing only). Nothing for a guest or in the Mini App.
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

  // A small text button beside the name in the profile - the name already
  // says who is signed in.
  return (
    <button
      type="button"
      disabled={isSigningOut}
      onClick={() => void handleSignOut()}
      className="shrink-0 flex items-center gap-1.5 min-h-11 px-2 -mr-2 text-sm font-semibold text-(--color-slate) cursor-pointer disabled:opacity-50"
    >
      <LogOut size={16} />
      {t("site.login.signOut")}
    </button>
  );
};

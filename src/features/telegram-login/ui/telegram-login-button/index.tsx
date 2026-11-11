import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { Send } from "lucide-react";

import { TELEGRAM_LOGIN_CLIENT_ID } from "@shared/constants";
import { useHaptic, usePopup } from "@shared/hooks";
import { PillButton } from "@shared/ui";

import { useTelegramSignIn } from "../../hooks/useTelegramSignIn";
import { getTelegramLogin, loadTelegramLogin, toTelegramLang } from "../../model";

interface Props {
  // Right after the sign-in - e.g. carries on with the purchase.
  onSignedIn?: () => void;
}

// «Войти через Telegram» - Log In With Telegram (OIDC): Telegram's popup asks
// for the profile and lets the bot write (receipts, expiry reminders); never
// the phone number.
export const TelegramLoginButton = ({ onSignedIn }: Props) => {
  const [isReady, setIsReady] = useState(() => Boolean(getTelegramLogin()));
  const [isSigningIn, setIsSigningIn] = useState(false);

  const { t, i18n } = useTranslation();

  const haptic = useHaptic();

  const showPopup = usePopup();

  const signIn = useTelegramSignIn();

  useEffect(() => {
    if (isReady) return;

    let isCurrent = true;

    loadTelegramLogin()
      .then(() => {
        if (isCurrent) setIsReady(true);
      })
      // No Telegram script (blocked, offline): the button stays off.
      .catch(() => undefined);

    return () => {
      isCurrent = false;
    };
  }, [isReady]);

  const handleClick = () => {
    const login = getTelegramLogin();

    if (!login || isSigningIn) return;

    haptic.light();

    // Synchronously in the tap - the popup must open from it.
    login.auth(
      { client_id: TELEGRAM_LOGIN_CLIENT_ID, scope: ["profile", "write"], lang: toTelegramLang(i18n.language) },
      (result) => {
        if (result.id_token) {
          setIsSigningIn(true);
          void signIn(result.id_token, result.user ?? {})
            .then((isSignedIn) => {
              if (isSignedIn) onSignedIn?.();
            })
            .finally(() => setIsSigningIn(false));
          return;
        }

        // Closed the window - the person changed their mind.
        if (result.error === "popup_closed") return;

        haptic.error();
        void showPopup({ message: t("site.login.failed") });
      }
    );
  };

  return (
    <PillButton
      type="button"
      onClick={handleClick}
      disabled={!isReady || isSigningIn}
      className="flex items-center gap-2 disabled:opacity-50"
    >
      <Send size={18} />
      {t("site.login.button")}
    </PillButton>
  );
};

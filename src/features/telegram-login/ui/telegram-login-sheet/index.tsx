import { useTranslation } from "react-i18next";

import { BottomSheet } from "@shared/ui";

import { useTelegramSignIn } from "../../hooks/useTelegramSignIn";
import { TelegramLoginWidget } from "../telegram-login-widget";

interface Props {
  // Why: «чтобы купить…» / «чтобы забрать подарок…».
  message: string;
  onClose: () => void;
  // Right after the sign-in - carries on with what the person tapped.
  onSignedIn: () => void;
}

// «Купить» / «Забрать подарок» by a website guest: sign in with Telegram
// first, then the same action goes on by itself.
export const TelegramLoginSheet = ({ message, onClose, onSignedIn }: Props) => {
  const { t } = useTranslation();

  const signIn = useTelegramSignIn();

  return (
    <BottomSheet title={t("site.login.title")} onClose={onClose}>
      {(close) => (
        <div className="flex flex-col items-center gap-4 pb-2 text-center">
          <p className="text-sm text-(--color-slate)">{message}</p>
          <TelegramLoginWidget
            onAuth={(authData) =>
              void signIn(authData).then((isSignedIn) => {
                if (!isSignedIn) return;

                close();
                onSignedIn();
              })
            }
          />
        </div>
      )}
    </BottomSheet>
  );
};

import { useTranslation } from "react-i18next";

import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { logInWithTelegram, type TelegramLoginClaims } from "@shared/api";
import { useGenericError, useHaptic, usePopup } from "@shared/hooks";
import { useAuthStore } from "@shared/store";

// Telegram's id_token → our account. Resolves to whether it worked.
export const useTelegramSignIn = () => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const haptic = useHaptic();

  const showPopup = usePopup();

  const showGenericError = useGenericError();

  return async (idToken: string, claims: TelegramLoginClaims) => {
    try {
      const { accessToken, role } = await logInWithTelegram(idToken, claims);

      // At once: the guest's JWT points at a user the merge just deleted.
      useAuthStore.getState().setAuth(accessToken, role, false);

      // Everything the guest had now lives under the Telegram account.
      void queryClient.invalidateQueries();

      return true;
    } catch (error) {
      // 401 - Telegram's token refused (expired, another bot); 400 - malformed.
      const status = isAxiosError(error) ? error.response?.status : undefined;

      if (status === 401 || status === 400) {
        haptic.error();
        void showPopup({ message: t("site.login.failed") });
      } else {
        showGenericError();
      }

      return false;
    }
  };
};

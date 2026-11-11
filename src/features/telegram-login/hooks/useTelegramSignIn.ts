import { useQueryClient } from "@tanstack/react-query";

import { logInWithTelegramWidget, type TelegramAuthData } from "@shared/api";
import { useGenericError } from "@shared/hooks";
import { useAuthStore } from "@shared/store";

// The widget's answer → the Telegram account. Resolves to whether it worked.
export const useTelegramSignIn = () => {
  const queryClient = useQueryClient();

  const showGenericError = useGenericError();

  return async (authData: TelegramAuthData) => {
    try {
      const { accessToken, role } = await logInWithTelegramWidget(authData);

      // At once: the guest's JWT points at a user the merge just deleted.
      useAuthStore.getState().setAuth(accessToken, role, false);

      // Everything the guest had now lives under the Telegram account.
      void queryClient.invalidateQueries();

      return true;
    } catch {
      showGenericError();

      return false;
    }
  };
};

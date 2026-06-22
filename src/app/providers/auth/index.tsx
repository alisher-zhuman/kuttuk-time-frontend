import { type ReactNode, useEffect } from "react";

import { miniApp, retrieveLaunchParams } from "@tma.js/sdk-react";

import { logIn } from "@shared/api";
import { useAuthStore } from "@shared/store";

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const isReady = useAuthStore((s) => s.isReady);

  useEffect(() => {
    const { accessToken, setAuth, setReady } = useAuthStore.getState();

    const telegramId = retrieveLaunchParams().tgWebAppData?.user?.id;

    if (!telegramId || accessToken) {
      setReady();
      if (miniApp.ready.isAvailable()) {
        miniApp.ready();
      }

      return;
    }

    logIn({ telegramId })
      .then(({ accessToken: token, role }) => {
        setAuth(token, role);
      })
      .catch(console.error)
      .finally(() => {
        setReady();

        if (miniApp.ready.isAvailable()) {
          miniApp.ready();
        }
      });
  }, []);

  if (!isReady) return null;

  return <>{children}</>;
};

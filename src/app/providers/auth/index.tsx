import { type ReactNode, useEffect } from "react";

import { miniApp, retrieveRawInitData } from "@tma.js/sdk-react";

import { logIn } from "@shared/api";
import { useAuthStore, useViewModeStore } from "@shared/store";

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const isReady = useAuthStore((s) => s.isReady);

  useEffect(() => {
    const { setAuth, setReady } = useAuthStore.getState();
    const { setViewMode } = useViewModeStore.getState();

    const initData = retrieveRawInitData();

    if (!initData) {
      setReady();
      if (miniApp.ready.isAvailable()) {
        miniApp.ready();
      }

      return;
    }

    logIn({ initData })
      .then(({ accessToken, role }) => {
        setAuth(accessToken, role);
        setViewMode(role === "admin" ? "admin" : "user");
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

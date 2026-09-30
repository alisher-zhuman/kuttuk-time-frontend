import { type ReactNode, useEffect } from "react";

import { retrieveRawInitData } from "@tma.js/sdk-react";
import { isAxiosError } from "axios";
import { Loader2 } from "lucide-react";

import { SessionExpiredPage } from "@pages/session-expired";

import { logIn } from "@shared/api";
import { useAuthStore, useViewModeStore } from "@shared/store";

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const isReady = useAuthStore((s) => s.isReady);
  const isSessionExpired = useAuthStore((s) => s.isSessionExpired);

  useEffect(() => {
    const { setAuth, setReady, setSessionExpired } = useAuthStore.getState();
    const { setViewMode } = useViewModeStore.getState();

    const initData = retrieveRawInitData();

    if (!initData) {
      setReady();
      return;
    }

    logIn({ initData })
      .then(({ accessToken, role }) => {
        setAuth(accessToken, role);
        setViewMode(
          role === "admin" ? "admin" : role === "merchant" ? "merchant" : "user"
        );
      })
      .catch((error: unknown) => {
        // A reload inside Telegram keeps the old initData, so the very first
        // log-in can already be rejected as expired.
        if (isAxiosError(error) && error.response?.status === 401) {
          setSessionExpired();
          return;
        }

        console.error(error);
      })
      .finally(() => {
        setReady();
      });
  }, []);

  if (isSessionExpired) return <SessionExpiredPage />;

  if (!isReady) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-(--color-bg)">
        <Loader2 size={28} color="var(--color-hint)" className="animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

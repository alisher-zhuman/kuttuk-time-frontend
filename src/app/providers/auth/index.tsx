import { type ReactNode, useEffect, useState } from "react";

import { retrieveRawInitData } from "@tma.js/sdk-react";
import { isAxiosError } from "axios";

import { ConnectionFailedPage } from "@pages/connection-failed";
import { SessionExpiredPage } from "@pages/session-expired";

import { logIn } from "@shared/api";
import { useAuthStore, useViewModeStore } from "@shared/store";
import { PageLoader } from "@shared/ui";

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  // Bumped by "Retry" on the connection-failed screen to log in again.
  const [attempt, setAttempt] = useState(0);
  const [isFailed, setIsFailed] = useState(false);

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
        setViewMode(role);
        setReady();
      })
      .catch((error: unknown) => {
        // A reload inside Telegram keeps the old initData, so the very first
        // log-in can already be rejected as expired.
        if (isAxiosError(error) && error.response?.status === 401) {
          setSessionExpired();
          return;
        }

        // Network, 5xx, a cold-starting backend: without a role the app would
        // open as a buyer (an owner or admin landing on the wrong screens) —
        // offer a retry instead.
        console.error(error);
        setIsFailed(true);
      });
  }, [attempt]);

  if (isSessionExpired) return <SessionExpiredPage />;

  if (isFailed) {
    return (
      <ConnectionFailedPage
        onRetry={() => {
          setIsFailed(false);
          setAttempt((value) => value + 1);
        }}
      />
    );
  }

  if (!isReady) {
    return <PageLoader fullScreen />;
  }

  return <>{children}</>;
};

import { type ReactNode, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { retrieveRawInitData } from "@tma.js/sdk-react";
import { isAxiosError } from "axios";

import { ConnectionFailedPage } from "@pages/connection-failed";
import { SessionExpiredPage } from "@pages/session-expired";

import { logIn, signInOnWebsite } from "@shared/api";
import { isWebsite, useAuthStore, useViewModeStore } from "@shared/store";
import { PageLoader } from "@shared/ui";

interface Props {
  children: ReactNode;
}

// Log-in usually answers within a second; past this the backend is most
// likely waking up (Koyeb sleeps when idle) - say so instead of a bare spinner.
const SLOW_LOG_IN_MS = 3000;

export const AuthProvider = ({ children }: Props) => {
  // Bumped by "Retry" on the connection-failed screen to log in again.
  const [attempt, setAttempt] = useState(0);
  const [isFailed, setIsFailed] = useState(false);
  const [isSlow, setIsSlow] = useState(false);

  const { t } = useTranslation();

  const isReady = useAuthStore((s) => s.isReady);
  const isSessionExpired = useAuthStore((s) => s.isSessionExpired);

  useEffect(() => {
    const { setAuth, setReady, setSessionExpired } = useAuthStore.getState();
    const { setViewMode } = useViewModeStore.getState();

    const isWeb = isWebsite();

    // retrieveRawInitData throws outside Telegram - the website never asks.
    const initData = isWeb ? null : retrieveRawInitData();

    if (!isWeb && !initData) {
      setReady();
      return;
    }

    const slowTimer = setTimeout(() => setIsSlow(true), SLOW_LOG_IN_MS);

    // The website: the Telegram account (widget) or a guest, by itself - no
    // sign-up. The Mini App: by initData.
    const signIn = isWeb
      ? signInOnWebsite()
      : logIn({ initData: initData! }).then((result) => ({ ...result, isGuest: false }));

    signIn
      .then(({ accessToken, role, isGuest }) => {
        setAuth(accessToken, role, isGuest);
        // The website shows only the buyer's screens, whatever the role.
        setViewMode(isWeb ? "user" : role);
        setReady();
      })
      .catch((error: unknown) => {
        // A reload inside Telegram keeps the old initData, so the very first
        // log-in can already be rejected as expired.
        if (!isWeb && isAxiosError(error) && error.response?.status === 401) {
          setSessionExpired();
          return;
        }

        // Network, 5xx, a cold-starting backend: without a role the app would
        // open as a buyer (an owner or admin landing on the wrong screens) -
        // offer a retry instead.
        console.error(error);
        setIsFailed(true);
      })
      .finally(() => {
        clearTimeout(slowTimer);
        setIsSlow(false);
      });

    return () => clearTimeout(slowTimer);
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
    return <PageLoader fullScreen message={isSlow ? t("connection.waking") : undefined} />;
  }

  return <>{children}</>;
};

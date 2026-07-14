import { type ReactNode, useEffect } from "react";

import { retrieveRawInitData } from "@tma.js/sdk-react";
import { Loader2 } from "lucide-react";

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
      return;
    }

    logIn({ initData })
      .then(({ accessToken, role }) => {
        setAuth(accessToken, role);
        setViewMode(
          role === "admin" ? "admin" : role === "merchant" ? "merchant" : "user"
        );
      })
      .catch(console.error)
      .finally(() => {
        setReady();
      });
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-(--color-bg)">
        <Loader2 size={28} color="var(--color-hint)" className="animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

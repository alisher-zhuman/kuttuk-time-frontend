import { useLayoutEffect } from "react";
import { Outlet } from "react-router";

import { TelegramOnlyPage } from "@pages/telegram-only";

import { getHomeRoute } from "@shared/constants";
import { useNavigateTo } from "@shared/hooks";
import { useAppModeStore,useAuthStore } from "@shared/store";

interface Props {
  role: "admin" | "merchant";
}

// AuthProvider wraps RouterProvider (see app/index.tsx) and blocks rendering
// until logIn resolves, so `role` is always already settled by the time any
// route under this guard renders - no loading state to handle here.
// Gates on `role` (real capability), not viewMode (current chrome preference):
// an admin who toggled to "view as buyer" can still deep-link back into
// /app/admin/..., only an account that genuinely isn't that role gets bounced.
export const RequireRole = ({ role }: Props) => {
  const navigateTo = useNavigateTo();

  const currentRole = useAuthStore((s) => s.role);

  const isWeb = useAppModeStore((s) => s.mode === "web");

  useLayoutEffect(() => {
    if (!isWeb && currentRole !== role) {
      navigateTo(getHomeRoute(currentRole), { replace: true });
    }
  }, [isWeb, currentRole, role, navigateTo]);

  // The website has no cabinet or admin panel - only a way to the Mini App.
  if (isWeb) return <TelegramOnlyPage />;

  if (currentRole !== role) return null;

  return <Outlet />;
};

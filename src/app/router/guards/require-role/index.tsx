import { useLayoutEffect } from "react";
import { Outlet } from "react-router";

import { getHomeRoute } from "@shared/constants";
import { useNavigateTo } from "@shared/hooks";
import { useAuthStore } from "@shared/store";

interface Props {
  role: "admin" | "merchant";
}

// AuthProvider wraps RouterProvider (see app/index.tsx) and blocks rendering
// until logIn resolves, so `role` is always already settled by the time any
// route under this guard renders — no loading state to handle here.
// Gates on `role` (real capability), not viewMode (current chrome preference):
// an admin who toggled to "view as buyer" can still deep-link back into
// /app/admin/..., only an account that genuinely isn't that role gets bounced.
export const RequireRole = ({ role }: Props) => {
  const navigateTo = useNavigateTo();

  const currentRole = useAuthStore((s) => s.role);

  useLayoutEffect(() => {
    if (currentRole !== role) {
      navigateTo(getHomeRoute(currentRole), { replace: true });
    }
  }, [currentRole, role, navigateTo]);

  if (currentRole !== role) return null;

  return <Outlet />;
};

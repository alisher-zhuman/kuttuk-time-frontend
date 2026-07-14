import { useLayoutEffect } from "react";

import { getMerchantRoute, ROUTE_PATTERNS } from "@shared/constants";
import { getLaunchParams } from "@shared/helpers";
import { useNavigateTo } from "@shared/hooks";
import { useViewModeStore } from "@shared/store";

// A component, not a loader: the redirect target depends on viewMode/role,
// which is only known after auth resolves. createBrowserRouter runs loaders at
// router-init time (module load) — before AuthProvider's logIn completes — so a
// loader would always read the default "user" mode. A component renders inside
// the router, i.e. after AuthProvider has unblocked, so viewMode is correct.
// useLayoutEffect + replace: true redirects before the empty "/" frame paints
// and overwrites the "/" history entry (so Back doesn't re-trigger this).
export const RootRedirect = () => {
  const navigateTo = useNavigateTo();

  useLayoutEffect(() => {
    const { viewMode } = useViewModeStore.getState();

    // Deep links are a buyer flow — admins and merchants always land on their
    // own dashboard.
    if (viewMode === "admin") {
      navigateTo(ROUTE_PATTERNS.ADMIN_MERCHANTS, { replace: true });
      return;
    }

    if (viewMode === "merchant") {
      navigateTo(ROUTE_PATTERNS.MERCHANT_HOME, { replace: true });
      return;
    }

    const startParam = getLaunchParams()?.tgWebAppStartParam;

    navigateTo(startParam ? getMerchantRoute(startParam) : ROUTE_PATTERNS.HOME, {
      replace: true
    });
  }, [navigateTo]);

  return null;
};

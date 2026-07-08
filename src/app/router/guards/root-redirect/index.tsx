import { useEffect } from "react";

import { getMerchantRoute, ROUTE_PATTERNS } from "@shared/constants";
import { getLaunchParams } from "@shared/helpers";
import { useNavigateTo } from "@shared/hooks";
import { useViewModeStore } from "@shared/store";

export const RootRedirect = () => {
  const navigateTo = useNavigateTo();

  useEffect(() => {
    const startParam = getLaunchParams()?.tgWebAppStartParam;

    if (startParam) {
      navigateTo(getMerchantRoute(startParam), { replace: true });
      return;
    }

    const { viewMode } = useViewModeStore.getState();

    navigateTo(
      viewMode === "admin" ? ROUTE_PATTERNS.ADMIN_MERCHANTS : ROUTE_PATTERNS.HOME,
      { replace: true }
    );
  }, [navigateTo]);

  return null;
};

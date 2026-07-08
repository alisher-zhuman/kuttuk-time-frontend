import { redirect } from "react-router";

import { getMerchantRoute, ROUTE_PATTERNS } from "@shared/constants";
import { getLaunchParams } from "@shared/helpers";
import { useViewModeStore } from "@shared/store";

export const rootRedirectLoader = () => {
  const startParam = getLaunchParams()?.tgWebAppStartParam;

  if (startParam) {
    return redirect(getMerchantRoute(startParam));
  }

  const { viewMode } = useViewModeStore.getState();

  return redirect(
    viewMode === "admin" ? ROUTE_PATTERNS.ADMIN_MERCHANTS : ROUTE_PATTERNS.HOME
  );
};

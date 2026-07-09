import { replace } from "react-router";

import { getMerchantRoute, ROUTE_PATTERNS } from "@shared/constants";
import { getLaunchParams } from "@shared/helpers";
import { useViewModeStore } from "@shared/store";

// replace() (not redirect()) so the "/" entry is overwritten rather than
// pushed under the target — otherwise Back lands on "/" and re-redirects,
// and useNavigationType() would report PUSH instead of REPLACE.
export const rootRedirectLoader = () => {
  const { viewMode } = useViewModeStore.getState();

  // Deep links are a buyer flow — admins always land on their dashboard.
  if (viewMode === "admin") {
    return replace(ROUTE_PATTERNS.ADMIN_MERCHANTS);
  }

  const startParam = getLaunchParams()?.tgWebAppStartParam;

  if (startParam) {
    return replace(getMerchantRoute(startParam));
  }

  return replace(ROUTE_PATTERNS.HOME);
};

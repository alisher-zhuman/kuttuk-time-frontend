import { replace } from "react-router";

import { getMerchantRoute, ROUTE_PATTERNS } from "@shared/constants";
import { getLaunchParams } from "@shared/helpers";
import { useViewModeStore } from "@shared/store";

// replace() (not redirect()) so the "/" entry is overwritten rather than
// pushed under the target — otherwise Back lands on "/" and re-redirects,
// and useNavigationType() would report PUSH instead of REPLACE.
export const rootRedirectLoader = () => {
  const startParam = getLaunchParams()?.tgWebAppStartParam;

  if (startParam) {
    return replace(getMerchantRoute(startParam));
  }

  const { viewMode } = useViewModeStore.getState();

  return replace(
    viewMode === "admin" ? ROUTE_PATTERNS.ADMIN_MERCHANTS : ROUTE_PATTERNS.HOME
  );
};

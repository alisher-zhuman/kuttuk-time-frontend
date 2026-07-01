import { useEffect } from "react";

import { getMerchantRoute, ROUTE_PATTERNS } from "@shared/constants";
import { getLaunchParams } from "@shared/helpers";
import { useNavigateTo } from "@shared/hooks";

export const RootRedirect = () => {
  const navigateTo = useNavigateTo();

  useEffect(() => {
    const startParam = getLaunchParams()?.tgWebAppStartParam;

    if (startParam) {
      navigateTo(getMerchantRoute(startParam), { replace: true });
    } else {
      navigateTo(ROUTE_PATTERNS.HOME, { replace: true });
    }
  }, [navigateTo]);

  return null;
};

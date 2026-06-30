import { useEffect } from "react";

import { getMerchantRoute, ROUTE_PATTERNS } from "@shared/constants";
import { getLaunchParams } from "@shared/helpers";
import { useNavigateTo } from "@shared/hooks";

export const RootRedirect = () => {
  const navigateTo = useNavigateTo();

  useEffect(() => {
    const startParam = getLaunchParams()?.tgWebAppStartParam;

    if (startParam) {
      navigateTo(getMerchantRoute(startParam));
    } else {
      navigateTo(ROUTE_PATTERNS.HOME);
    }
  }, [navigateTo]);

  return null;
};

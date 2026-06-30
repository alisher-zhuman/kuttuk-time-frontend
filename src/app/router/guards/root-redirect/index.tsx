import { Navigate } from "react-router";

import { getMerchantRoute, ROUTE_PATTERNS } from "@shared/constants";
import { getLaunchParams } from "@shared/helpers";

export const RootRedirect = () => {
  const startParam = getLaunchParams()?.tgWebAppStartParam;

  if (startParam) {
    return <Navigate to={getMerchantRoute(startParam)} replace />;
  }

  return <Navigate to={ROUTE_PATTERNS.HOME} replace />;
};

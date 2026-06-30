import { Navigate } from "react-router";

import { getMerchantRoute, ROUTE_PATTERNS } from "@shared/constants";
import { getLaunchParams } from "@shared/helpers";

export const RootRedirect = () => {
  const params = getLaunchParams();
  const startParam = params?.tgWebAppStartParam;

  console.warn("[RootRedirect] launchParams:", JSON.stringify(params));
  console.warn("[RootRedirect] startParam:", startParam);
  console.warn("[RootRedirect] href:", window.location.href);

  if (startParam) {
    return <Navigate to={getMerchantRoute(startParam)} replace />;
  }

  return <Navigate to={ROUTE_PATTERNS.HOME} replace />;
};

import { useEffect } from "react";

import { useNavigate } from "react-router";

import { getLaunchParams } from "@shared/helpers";
import { getMerchantRoute, ROUTE_PATTERNS } from "@shared/constants";

export const RootRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const startParam = getLaunchParams()?.tgWebAppStartParam;
    if (startParam) {
      void navigate(getMerchantRoute(startParam), { replace: true });
    } else {
      void navigate(ROUTE_PATTERNS.HOME, { replace: true });
    }
  }, [navigate]);

  return null;
};

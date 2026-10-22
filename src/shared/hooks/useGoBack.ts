import { useCallback } from "react";
import { useLocation } from "react-router";

import { getHomeRoute, ROUTE_PATTERNS } from "@shared/constants";
import { canGoBack } from "@shared/helpers";
import { useViewModeStore } from "@shared/store";

import { useNavigateTo } from "./useNavigateTo";

// Each mode's root screens (home, bottom-nav tabs): nothing to go back to.
const ROOT_PATHS: string[] = [
  ROUTE_PATTERNS.HOME,
  ROUTE_PATTERNS.ADMIN_VENUES,
  ROUTE_PATTERNS.ADMIN_MERCHANTS,
  ROUTE_PATTERNS.ADMIN_ORDERS,
  ROUTE_PATTERNS.ADMIN_PAYOUTS,
  ROUTE_PATTERNS.MERCHANT_HOME,
  ROUTE_PATTERNS.MERCHANT_SUMMARY,
  ROUTE_PATTERNS.MERCHANT_CERTIFICATES
];

// One "back" for the native Back button and the edge swipe: the previous
// screen if this session has one, else the mode's home (an app opened straight
// on a deep link has no history to go back to).
export const useGoBack = () => {
  const { pathname } = useLocation();

  const navigateTo = useNavigateTo();

  const viewMode = useViewModeStore((s) => s.viewMode);

  const goBack = useCallback(() => {
    if (canGoBack()) {
      navigateTo(-1);
    } else {
      navigateTo(getHomeRoute(viewMode));
    }
  }, [navigateTo, viewMode]);

  return { isRoot: ROOT_PATHS.includes(pathname), goBack };
};

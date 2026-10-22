import {
  getOrderRoute,
  getVenueRoute,
  ORDER_START_PARAM_PREFIX,
  ROUTE_PATTERNS,
  type ViewMode
} from "@shared/constants";

// Where a launch lands: startapp=order_<uuid> (back from Finik) → that order
// for any role — anyone can buy; otherwise the admin and the owner open their
// own home, and a buyer the venue from startapp=<handle> or the catalog.
export const getStartRoute = (startParam: string | undefined, viewMode: ViewMode) => {
  if (startParam?.startsWith(ORDER_START_PARAM_PREFIX)) {
    return getOrderRoute(startParam.slice(ORDER_START_PARAM_PREFIX.length));
  }

  if (viewMode === "admin") return ROUTE_PATTERNS.ADMIN_VENUES;
  if (viewMode === "merchant") return ROUTE_PATTERNS.MERCHANT_HOME;

  return startParam ? getVenueRoute(startParam) : ROUTE_PATTERNS.HOME;
};

import {
  getGiftRoute,
  getOrderRoute,
  getVenueRoute,
  GIFT_START_PARAM_PREFIX,
  MY_CERTIFICATES_START_PARAM,
  ORDER_START_PARAM_PREFIX,
  ROUTE_PATTERNS,
  type ViewMode
} from "@shared/constants";

// Where a launch lands. Personal links come first, for any role - anyone can
// buy, be gifted or get a reminder: startapp=order_<uuid> (back from Finik) →
// that order, gift_<token> → «Забрать подарок», my_certificates → «Мои
// сертификаты». Otherwise the admin and the owner open their own home, and a
// buyer the venue from startapp=<handle> or the catalog.
export const getStartRoute = (startParam: string | undefined, viewMode: ViewMode) => {
  if (startParam?.startsWith(ORDER_START_PARAM_PREFIX)) {
    return getOrderRoute(startParam.slice(ORDER_START_PARAM_PREFIX.length));
  }

  if (startParam?.startsWith(GIFT_START_PARAM_PREFIX)) {
    return getGiftRoute(startParam.slice(GIFT_START_PARAM_PREFIX.length));
  }

  // The profile opens on its certificates tab.
  if (startParam === MY_CERTIFICATES_START_PARAM) return ROUTE_PATTERNS.PROFILE;

  if (viewMode === "admin") return ROUTE_PATTERNS.ADMIN_VENUES;
  if (viewMode === "merchant") return ROUTE_PATTERNS.MERCHANT_HOME;

  return startParam ? getVenueRoute(startParam) : ROUTE_PATTERNS.HOME;
};

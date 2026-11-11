import {
  ADMIN_PAYOUTS_START_PARAM,
  getAdminPayoutsRoute,
  getGiftRoute,
  getOrderRoute,
  getVenueRoute,
  GIFT_START_PARAM_PREFIX,
  MY_CERTIFICATES_START_PARAM,
  ORDER_START_PARAM_PREFIX,
  ROUTE_PATTERNS,
  type ViewMode
} from "@shared/constants";

// Where a launch lands. Every link opens what it points to, for any role -
// anyone can buy, be gifted or get a reminder, and an owner checking their own
// venue link must see the storefront, not the cabinet: order_<uuid> (back from
// Finik) → that order, gift_<token> → «Забрать подарок», my_certificates →
// «Мои сертификаты», admin_payouts → «Все долги» (admins only), any other
// value → the venue by its handle. Without a link the admin and the owner open
// their own home, a buyer the catalog.
export const getStartRoute = (startParam: string | undefined, viewMode: ViewMode) => {
  if (startParam?.startsWith(ORDER_START_PARAM_PREFIX)) {
    return getOrderRoute(startParam.slice(ORDER_START_PARAM_PREFIX.length));
  }

  if (startParam?.startsWith(GIFT_START_PARAM_PREFIX)) {
    return getGiftRoute(startParam.slice(GIFT_START_PARAM_PREFIX.length));
  }

  // The profile opens on its certificates tab.
  if (startParam === MY_CERTIFICATES_START_PARAM) return ROUTE_PATTERNS.PROFILE;

  // For an admin - every debt; for anyone else not a venue handle, just home.
  if (startParam === ADMIN_PAYOUTS_START_PARAM) {
    if (viewMode === "admin") return getAdminPayoutsRoute({ view: "due" });
  } else if (startParam) {
    return getVenueRoute(startParam);
  }

  if (viewMode === "admin") return ROUTE_PATTERNS.ADMIN_VENUES;
  // The owner's everyday job is the counter - the cabinet opens on it.
  if (viewMode === "merchant") return ROUTE_PATTERNS.MERCHANT_CERTIFICATES;

  return ROUTE_PATTERNS.HOME;
};

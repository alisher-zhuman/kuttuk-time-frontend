import { WEB_GIFT_PATH, WEB_ORDER_PATH } from "./base";

export const ROUTES = {
  APP: "app",
  PROFILE: "profile",
  MERCHANTS: "merchants",
  VENUES: "venues",
  ADMIN: "admin",
  ORDERS: "orders",
  PAYOUTS: "payouts",
  CATEGORIES: "categories",
  CERTIFICATES: "certificates",
  GIFTS: "gifts",
  CATEGORY_CREATE: "category-create",
  CATEGORY_EDIT: "category-edit",
  MERCHANT_CREATE: "merchant-create",
  MERCHANT_EDIT: "merchant-edit",
  VENUE_CREATE: "venue-create",
  VENUE_EDIT: "venue-edit",
  MERCHANT_HOME: "merchant",
  EDIT: "edit",
  SUMMARY: "summary",
  ABOUT: "about",
  OFFER: "offer"
} as const;

export const ROUTE_PATTERNS = {
  HOME: `/${ROUTES.APP}`,
  PROFILE: `/${ROUTES.APP}/${ROUTES.PROFILE}`,
  VENUE: `/${ROUTES.APP}/${ROUTES.VENUES}/:handle`,
  ORDER: `/${ROUTES.APP}/${ROUTES.ORDERS}/:orderId`,
  CERTIFICATE: `/${ROUTES.APP}/${ROUTES.CERTIFICATES}/:certificateId`,
  GIFT: `/${ROUTES.APP}/${ROUTES.GIFTS}/:token`,
  // The website's addresses the backend links to (Finik's return, gift links).
  WEB_ORDER: `${WEB_ORDER_PATH}:orderId`,
  WEB_GIFT: `${WEB_GIFT_PATH}:token`,
  ABOUT: `/${ROUTES.APP}/${ROUTES.ABOUT}`,
  OFFER: `/${ROUTES.APP}/${ROUTES.OFFER}`,
  MERCHANT_HOME: `/${ROUTES.APP}/${ROUTES.MERCHANT_HOME}`,
  MERCHANT_VENUE_EDIT: `/${ROUTES.APP}/${ROUTES.MERCHANT_HOME}/${ROUTES.VENUES}/:venueId/${ROUTES.EDIT}`,
  MERCHANT_SUMMARY: `/${ROUTES.APP}/${ROUTES.MERCHANT_HOME}/${ROUTES.SUMMARY}`,
  MERCHANT_CERTIFICATES: `/${ROUTES.APP}/${ROUTES.MERCHANT_HOME}/${ROUTES.CERTIFICATES}`,
  ADMIN_VENUES: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.VENUES}`,
  ADMIN_VENUE_CREATE: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.VENUE_CREATE}`,
  ADMIN_VENUE_DETAIL: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.VENUES}/:id`,
  ADMIN_VENUE_EDIT: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.VENUE_EDIT}/:id`,
  ADMIN_MERCHANTS: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.MERCHANTS}`,
  ADMIN_MERCHANT_CREATE: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.MERCHANT_CREATE}`,
  ADMIN_MERCHANT_DETAIL: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.MERCHANTS}/:id`,
  ADMIN_MERCHANT_EDIT: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.MERCHANT_EDIT}/:id`,
  ADMIN_ORDERS: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.ORDERS}`,
  ADMIN_ORDER_DETAIL: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.ORDERS}/:id`,
  ADMIN_PAYOUTS: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.PAYOUTS}`,
  ADMIN_CATEGORIES: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.CATEGORIES}`,
  ADMIN_CATEGORY_CREATE: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.CATEGORY_CREATE}`,
  ADMIN_CATEGORY_EDIT: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.CATEGORY_EDIT}/:id`
} as const;

export const getVenueRoute = (handle: string | number) =>
  `/${ROUTES.APP}/${ROUTES.VENUES}/${handle}`;

export const getOrderRoute = (orderId: string) =>
  `/${ROUTES.APP}/${ROUTES.ORDERS}/${orderId}`;

// justClaimed: opened by «Забрать подарок» - the screen says what to do now.
export const getCertificateRoute = (certificateId: string, { justClaimed = false } = {}) =>
  `/${ROUTES.APP}/${ROUTES.CERTIFICATES}/${certificateId}` + (justClaimed ? "?claimed=1" : "");

export const getGiftRoute = (token: string) => `/${ROUTES.APP}/${ROUTES.GIFTS}/${token}`;

export const getOwnVenueEditRoute = (venueId: string | number) =>
  `/${ROUTES.APP}/${ROUTES.MERCHANT_HOME}/${ROUTES.VENUES}/${venueId}/${ROUTES.EDIT}`;

export const getAdminVenueDetailRoute = (id: string | number) =>
  `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.VENUES}/${id}`;

export const getAdminVenueEditRoute = (id: string | number) =>
  `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.VENUE_EDIT}/${id}`;

// merchantId preselects the owner when adding a venue from a merchant's page.
export const getAdminVenueCreateRoute = (merchantId?: number) =>
  `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.VENUE_CREATE}` +
  (merchantId !== undefined ? `?merchantId=${merchantId}` : "");

export const getAdminMerchantDetailRoute = (id: string | number) =>
  `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.MERCHANTS}/${id}`;

export const getAdminOrderDetailRoute = (id: string) =>
  `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.ORDERS}/${id}`;

// Preselected filters: «На проверке» from the payouts warning, one venue's or
// one owner's orders from their card, one buyer's from an order.
export const getAdminOrdersRoute = (
  filters: { status?: string; venueId?: number; merchantId?: number; userId?: number } = {}
) => {
  const query = new URLSearchParams();

  if (filters.status) query.set("status", filters.status);
  if (filters.venueId !== undefined) query.set("venueId", String(filters.venueId));
  if (filters.merchantId !== undefined) query.set("merchantId", String(filters.merchantId));
  if (filters.userId !== undefined) query.set("userId", String(filters.userId));

  const search = query.toString();

  return `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.ORDERS}` + (search ? `?${search}` : "");
};

export const getCategoryEditRoute = (id: string | number) =>
  `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.CATEGORY_EDIT}/${id}`;

export const getAdminMerchantEditRoute = (id: string | number) =>
  `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.MERCHANT_EDIT}/${id}`;

export const getHomeRoute = (mode: string | null) => {
  if (mode === "admin") return ROUTE_PATTERNS.ADMIN_VENUES;
  // The counter (code field), not the venues - what the owner opens it for.
  if (mode === "merchant") return ROUTE_PATTERNS.MERCHANT_CERTIFICATES;
  return ROUTE_PATTERNS.HOME;
};

// «Выплаты»: view "due" - every debt at once («Все долги»); week - the weekly
// report on that week (any date inside it), else the previous week.
export const getAdminPayoutsRoute = (params: { view?: "due"; week?: string } = {}) => {
  const query = new URLSearchParams();

  if (params.view) query.set("view", params.view);
  if (params.week) query.set("week", params.week);

  const search = query.toString();

  return `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.PAYOUTS}` + (search ? `?${search}` : "");
};

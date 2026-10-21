export const ROUTES = {
  APP: "app",
  PROFILE: "profile",
  MERCHANTS: "merchants",
  VENUES: "venues",
  ADMIN: "admin",
  ORDERS: "orders",
  PAYMENTS: "payments",
  CATEGORIES: "categories",
  CERTIFICATES: "certificates",
  CATEGORY_CREATE: "category-create",
  CATEGORY_EDIT: "category-edit",
  MERCHANT_CREATE: "merchant-create",
  MERCHANT_EDIT: "merchant-edit",
  VENUE_CREATE: "venue-create",
  VENUE_EDIT: "venue-edit",
  MERCHANT_HOME: "merchant",
  EDIT: "edit",
  REDEEM: "redeem",
  SUMMARY: "summary"
} as const;

export const ROUTE_PATTERNS = {
  HOME: `/${ROUTES.APP}`,
  PROFILE: `/${ROUTES.APP}/${ROUTES.PROFILE}`,
  VENUE: `/${ROUTES.APP}/${ROUTES.VENUES}/:handle`,
  ORDER: `/${ROUTES.APP}/${ROUTES.ORDERS}/:orderId`,
  CERTIFICATE: `/${ROUTES.APP}/${ROUTES.CERTIFICATES}/:certificateId`,
  MERCHANT_HOME: `/${ROUTES.APP}/${ROUTES.MERCHANT_HOME}`,
  MERCHANT_VENUE_EDIT: `/${ROUTES.APP}/${ROUTES.MERCHANT_HOME}/${ROUTES.VENUES}/:venueId/${ROUTES.EDIT}`,
  MERCHANT_REDEEM: `/${ROUTES.APP}/${ROUTES.MERCHANT_HOME}/${ROUTES.REDEEM}`,
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
  ADMIN_PAYMENTS: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.PAYMENTS}`,
  ADMIN_CATEGORIES: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.CATEGORIES}`,
  ADMIN_CATEGORY_CREATE: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.CATEGORY_CREATE}`,
  ADMIN_CATEGORY_EDIT: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.CATEGORY_EDIT}/:id`
} as const;

export const getVenueRoute = (handle: string | number) =>
  `/${ROUTES.APP}/${ROUTES.VENUES}/${handle}`;

export const getOrderRoute = (orderId: string) =>
  `/${ROUTES.APP}/${ROUTES.ORDERS}/${orderId}`;

export const getCertificateRoute = (certificateId: string) =>
  `/${ROUTES.APP}/${ROUTES.CERTIFICATES}/${certificateId}`;

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

// code: opened from an active row of the certificate list — prefilled and checked.
export const getRedeemRoute = (code?: string) =>
  `/${ROUTES.APP}/${ROUTES.MERCHANT_HOME}/${ROUTES.REDEEM}` +
  (code ? `?code=${encodeURIComponent(code)}` : "");

export const getCategoryEditRoute = (id: string | number) =>
  `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.CATEGORY_EDIT}/${id}`;

export const getAdminMerchantEditRoute = (id: string | number) =>
  `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.MERCHANT_EDIT}/${id}`;

export const getHomeRoute = (mode: string | null) => {
  if (mode === "admin") return ROUTE_PATTERNS.ADMIN_VENUES;
  if (mode === "merchant") return ROUTE_PATTERNS.MERCHANT_HOME;
  return ROUTE_PATTERNS.HOME;
};

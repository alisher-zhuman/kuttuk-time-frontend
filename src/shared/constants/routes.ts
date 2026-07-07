export const ROUTES = {
  APP: "app",
  PROFILE: "profile",
  MERCHANTS: "merchants",
  ADMIN: "admin",
  ORDERS: "orders",
  PAYMENTS: "payments",
  CATEGORIES: "categories",
} as const;

export const ROUTE_PATTERNS = {
  HOME: `/${ROUTES.APP}`,
  PROFILE: `/${ROUTES.APP}/${ROUTES.PROFILE}`,
  MERCHANT: `/${ROUTES.APP}/${ROUTES.MERCHANTS}/:handle`,
  ADMIN_MERCHANTS: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.MERCHANTS}`,
  ADMIN_ORDERS: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.ORDERS}`,
  ADMIN_PAYMENTS: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.PAYMENTS}`,
  ADMIN_CATEGORIES_NEW: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.CATEGORIES}/new`,
} as const;

export const getMerchantRoute = (handle: string | number) =>
  `/${ROUTES.APP}/${ROUTES.MERCHANTS}/${handle}`;

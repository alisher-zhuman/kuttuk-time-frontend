export const ROUTES = {
  APP: "app",
  PROFILE: "profile",
  MERCHANTS: "merchants",
} as const;

export const ROUTE_PATTERNS = {
  HOME: `/${ROUTES.APP}`,
  PROFILE: `/${ROUTES.APP}/${ROUTES.PROFILE}`,
  MERCHANT: `/${ROUTES.APP}/${ROUTES.MERCHANTS}/:merchantId`,
} as const;

export const getMerchantRoute = (merchantId: number) =>
  `/${ROUTES.APP}/${ROUTES.MERCHANTS}/${merchantId}`;

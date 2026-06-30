export const ROUTES = {
  APP: "app",
  PROFILE: "profile",
  MERCHANTS: "merchants",
} as const;

export const ROUTE_PATTERNS = {
  HOME: `/${ROUTES.APP}`,
  PROFILE: `/${ROUTES.APP}/${ROUTES.PROFILE}`,
  MERCHANT: `/${ROUTES.APP}/${ROUTES.MERCHANTS}/:handle`,
} as const;

export const getMerchantRoute = (handle: string | number) =>
  `/${ROUTES.APP}/${ROUTES.MERCHANTS}/${handle}`;

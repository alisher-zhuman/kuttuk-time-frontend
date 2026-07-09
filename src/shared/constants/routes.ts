export const ROUTES = {
  APP: "app",
  PROFILE: "profile",
  MERCHANTS: "merchants",
  ADMIN: "admin",
  ORDERS: "orders",
  PAYMENTS: "payments",
  CATEGORIES: "categories",
  CATEGORY_CREATE: "category-create",
  CATEGORY_EDIT: "category-edit"
} as const;

export const ROUTE_PATTERNS = {
  HOME: `/${ROUTES.APP}`,
  PROFILE: `/${ROUTES.APP}/${ROUTES.PROFILE}`,
  MERCHANT: `/${ROUTES.APP}/${ROUTES.MERCHANTS}/:handle`,
  ADMIN_MERCHANTS: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.MERCHANTS}`,
  ADMIN_MERCHANT_DETAIL: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.MERCHANTS}/:id`,
  ADMIN_ORDERS: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.ORDERS}`,
  ADMIN_PAYMENTS: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.PAYMENTS}`,
  ADMIN_CATEGORIES: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.CATEGORIES}`,
  ADMIN_CATEGORY_CREATE: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.CATEGORY_CREATE}`,
  ADMIN_CATEGORY_EDIT: `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.CATEGORY_EDIT}/:id`
} as const;

export const getMerchantRoute = (handle: string | number) =>
  `/${ROUTES.APP}/${ROUTES.MERCHANTS}/${handle}`;

export const getAdminMerchantDetailRoute = (id: string | number) =>
  `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.MERCHANTS}/${id}`;

export const getCategoryEditRoute = (id: string | number) =>
  `/${ROUTES.APP}/${ROUTES.ADMIN}/${ROUTES.CATEGORY_EDIT}/${id}`;

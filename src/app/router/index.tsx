import { createBrowserRouter } from "react-router";

import { AdminCategoriesPage } from "@pages/admin/categories";
import { AdminCategoryCreatePage } from "@pages/admin/categories/new";
import { AdminMerchantsPage } from "@pages/admin/merchants";
import { AdminOrdersPage } from "@pages/admin/orders";
import { AdminPaymentsPage } from "@pages/admin/payments";
import { HomePage } from "@pages/home";
import { MerchantPage } from "@pages/merchant";
import { NotFoundPage } from "@pages/not-found";
import { ProfilePage } from "@pages/profile";

import { AppLayout } from "@widgets/layout";

import { ROUTE_PATTERNS } from "@shared/constants";

import { RootRedirect } from "./guards/root-redirect";

export const ROUTER = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: ROUTE_PATTERNS.HOME,
        element: <HomePage />,
      },
      {
        path: ROUTE_PATTERNS.PROFILE,
        element: <ProfilePage />,
      },
      {
        path: ROUTE_PATTERNS.MERCHANT,
        element: <MerchantPage />,
      },
      {
        path: ROUTE_PATTERNS.ADMIN_MERCHANTS,
        element: <AdminMerchantsPage />,
      },
      {
        path: ROUTE_PATTERNS.ADMIN_CATEGORIES,
        element: <AdminCategoriesPage />,
      },
      {
        path: ROUTE_PATTERNS.ADMIN_CATEGORIES_NEW,
        element: <AdminCategoryCreatePage />,
      },
      {
        path: ROUTE_PATTERNS.ADMIN_ORDERS,
        element: <AdminOrdersPage />,
      },
      {
        path: ROUTE_PATTERNS.ADMIN_PAYMENTS,
        element: <AdminPaymentsPage />,
      },
      {
        id: "not-found",
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

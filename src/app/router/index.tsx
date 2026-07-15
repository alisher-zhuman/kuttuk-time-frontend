import { createBrowserRouter } from "react-router";

import { AdminCategoriesPage } from "@pages/admin/categories";
import { AdminCategoryCreatePage } from "@pages/admin/category-create";
import { AdminCategoryEditPage } from "@pages/admin/category-edit";
import { AdminMerchantCreatePage } from "@pages/admin/merchant-create";
import { AdminMerchantDetailPage } from "@pages/admin/merchant-detail";
import { AdminMerchantEditPage } from "@pages/admin/merchant-edit";
import { AdminMerchantsPage } from "@pages/admin/merchants";
import { AdminOrdersPage } from "@pages/admin/orders";
import { AdminPaymentsPage } from "@pages/admin/payments";
import { HomePage } from "@pages/home";
import { MerchantPage } from "@pages/merchant";
import { MerchantHomePage } from "@pages/merchant-home";
import { MerchantProfileEditPage } from "@pages/merchant-profile-edit";
import { NotFoundPage } from "@pages/not-found";
import { ProfilePage } from "@pages/profile";

import { AppLayout } from "@widgets/layout";

import { ROUTE_PATTERNS } from "@shared/constants";

import { RequireRole } from "./guards/require-role";
import { RootRedirect } from "./guards/root-redirect";

export const ROUTER = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: ROUTE_PATTERNS.HOME,
        element: <HomePage />
      },
      {
        path: ROUTE_PATTERNS.PROFILE,
        element: <ProfilePage />
      },
      {
        path: ROUTE_PATTERNS.MERCHANT,
        element: <MerchantPage />
      },
      {
        element: <RequireRole role="admin" />,
        children: [
          {
            path: ROUTE_PATTERNS.ADMIN_MERCHANTS,
            element: <AdminMerchantsPage />
          },
          {
            path: ROUTE_PATTERNS.ADMIN_MERCHANT_CREATE,
            element: <AdminMerchantCreatePage />
          },
          {
            path: ROUTE_PATTERNS.ADMIN_MERCHANT_DETAIL,
            element: <AdminMerchantDetailPage />
          },
          {
            path: ROUTE_PATTERNS.ADMIN_MERCHANT_EDIT,
            element: <AdminMerchantEditPage />
          },
          {
            path: ROUTE_PATTERNS.ADMIN_CATEGORIES,
            element: <AdminCategoriesPage />
          },
          {
            path: ROUTE_PATTERNS.ADMIN_CATEGORY_CREATE,
            element: <AdminCategoryCreatePage />
          },
          {
            path: ROUTE_PATTERNS.ADMIN_CATEGORY_EDIT,
            element: <AdminCategoryEditPage />
          },
          {
            path: ROUTE_PATTERNS.ADMIN_ORDERS,
            element: <AdminOrdersPage />
          },
          {
            path: ROUTE_PATTERNS.ADMIN_PAYMENTS,
            element: <AdminPaymentsPage />
          }
        ]
      },
      {
        element: <RequireRole role="merchant" />,
        children: [
          {
            path: ROUTE_PATTERNS.MERCHANT_HOME,
            element: <MerchantHomePage />
          },
          {
            path: ROUTE_PATTERNS.MERCHANT_PROFILE_EDIT,
            element: <MerchantProfileEditPage />
          }
        ]
      },
      {
        id: "not-found",
        path: "*",
        element: <NotFoundPage />
      }
    ]
  }
]);

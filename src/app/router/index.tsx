import { type ComponentType } from "react";
import { createBrowserRouter } from "react-router";

import { CertificatePage } from "@pages/certificate";
import { HomePage } from "@pages/home";
import { NotFoundPage } from "@pages/not-found";
import { OrderPage } from "@pages/order";
import { ProfilePage } from "@pages/profile";
import { VenuePage } from "@pages/venue";

import { AppLayout } from "@widgets/layout";

import { ROUTE_PATTERNS } from "@shared/constants";
import { PageLoader } from "@shared/ui";

import { RequireRole } from "./guards/require-role";
import { RootRedirect } from "./guards/root-redirect";
import { RouteError } from "./route-error";

// Admin and owner screens load on demand: a buyer — most users — never
// downloads them (or their form / drag-and-drop libraries).
const page =
  <M extends Record<string, ComponentType>>(load: () => Promise<M>, name: keyof M) =>
  async () => ({ Component: (await load())[name] });

// Shown while a lazy route's chunk loads on the very first render (e.g. the
// app opened straight into the cabinet).
const loader = <PageLoader fullScreen />;

export const ROUTER = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
    errorElement: <RouteError />
  },
  {
    element: <AppLayout />,
    errorElement: <RouteError />,
    hydrateFallbackElement: loader,
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
        path: ROUTE_PATTERNS.VENUE,
        element: <VenuePage />
      },
      {
        path: ROUTE_PATTERNS.ORDER,
        element: <OrderPage />
      },
      {
        path: ROUTE_PATTERNS.CERTIFICATE,
        element: <CertificatePage />
      },
      {
        element: <RequireRole role="admin" />,
        children: [
          {
            path: ROUTE_PATTERNS.ADMIN_VENUES,
            lazy: page(() => import("@pages/venues/list"), "VenueListPage")
          },
          {
            path: ROUTE_PATTERNS.ADMIN_VENUE_CREATE,
            lazy: page(() => import("@pages/venues/create"), "VenueCreatePage")
          },
          {
            path: ROUTE_PATTERNS.ADMIN_VENUE_DETAIL,
            lazy: page(() => import("@pages/venues/detail"), "VenueDetailPage")
          },
          {
            path: ROUTE_PATTERNS.ADMIN_VENUE_EDIT,
            lazy: page(() => import("@pages/venues/edit"), "VenueEditPage")
          },
          {
            path: ROUTE_PATTERNS.ADMIN_MERCHANTS,
            lazy: page(() => import("@pages/merchants/list"), "MerchantListPage")
          },
          {
            path: ROUTE_PATTERNS.ADMIN_MERCHANT_CREATE,
            lazy: page(() => import("@pages/merchants/create"), "MerchantCreatePage")
          },
          {
            path: ROUTE_PATTERNS.ADMIN_MERCHANT_DETAIL,
            lazy: page(() => import("@pages/merchants/detail"), "MerchantDetailPage")
          },
          {
            path: ROUTE_PATTERNS.ADMIN_MERCHANT_EDIT,
            lazy: page(() => import("@pages/merchants/edit"), "MerchantEditPage")
          },
          {
            path: ROUTE_PATTERNS.ADMIN_CATEGORIES,
            lazy: page(() => import("@pages/categories/list"), "CategoryListPage")
          },
          {
            path: ROUTE_PATTERNS.ADMIN_CATEGORY_CREATE,
            lazy: page(() => import("@pages/categories/create"), "CategoryCreatePage")
          },
          {
            path: ROUTE_PATTERNS.ADMIN_CATEGORY_EDIT,
            lazy: page(() => import("@pages/categories/edit"), "CategoryEditPage")
          },
          {
            path: ROUTE_PATTERNS.ADMIN_ORDERS,
            lazy: page(() => import("@pages/orders/list"), "OrderListPage")
          },
          {
            path: ROUTE_PATTERNS.ADMIN_ORDER_DETAIL,
            lazy: page(() => import("@pages/orders/detail"), "OrderDetailPage")
          },
          {
            path: ROUTE_PATTERNS.ADMIN_PAYOUTS,
            lazy: page(() => import("@pages/payouts"), "PayoutsPage")
          }
        ]
      },
      {
        element: <RequireRole role="merchant" />,
        children: [
          {
            path: ROUTE_PATTERNS.MERCHANT_HOME,
            lazy: page(() => import("@pages/merchants/cabinet"), "MerchantCabinetPage")
          },
          {
            path: ROUTE_PATTERNS.MERCHANT_VENUE_EDIT,
            lazy: page(() => import("@pages/venues/own-edit"), "OwnVenueEditPage")
          },
          {
            path: ROUTE_PATTERNS.MERCHANT_SUMMARY,
            lazy: page(() => import("@pages/merchants/summary"), "MerchantSummaryPage")
          },
          {
            path: ROUTE_PATTERNS.MERCHANT_CERTIFICATES,
            lazy: page(() => import("@pages/merchants/certificates"), "MerchantCertificatesPage")
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

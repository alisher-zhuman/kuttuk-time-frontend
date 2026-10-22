import { createBrowserRouter } from "react-router";

import { CategoryCreatePage } from "@pages/categories/create";
import { CategoryEditPage } from "@pages/categories/edit";
import { CategoryListPage } from "@pages/categories/list";
import { CertificatePage } from "@pages/certificate";
import { HomePage } from "@pages/home";
import { MerchantCabinetPage } from "@pages/merchants/cabinet";
import { MerchantCertificatesPage } from "@pages/merchants/certificates";
import { MerchantCreatePage } from "@pages/merchants/create";
import { MerchantDetailPage } from "@pages/merchants/detail";
import { MerchantEditPage } from "@pages/merchants/edit";
import { MerchantListPage } from "@pages/merchants/list";
import { MerchantSummaryPage } from "@pages/merchants/summary";
import { NotFoundPage } from "@pages/not-found";
import { OrderPage } from "@pages/order";
import { OrderDetailPage } from "@pages/orders/detail";
import { OrderListPage } from "@pages/orders/list";
import { PayoutsPage } from "@pages/payouts";
import { ProfilePage } from "@pages/profile";
import { VenuePage } from "@pages/venue";
import { VenueCreatePage } from "@pages/venues/create";
import { VenueDetailPage } from "@pages/venues/detail";
import { VenueEditPage } from "@pages/venues/edit";
import { VenueListPage } from "@pages/venues/list";
import { OwnVenueEditPage } from "@pages/venues/own-edit";

import { AppLayout } from "@widgets/layout";

import { ROUTE_PATTERNS } from "@shared/constants";

import { RequireRole } from "./guards/require-role";
import { RootRedirect } from "./guards/root-redirect";
import { RouteError } from "./route-error";

export const ROUTER = createBrowserRouter([
  {
    path: "/",
    element: <RootRedirect />,
    errorElement: <RouteError />
  },
  {
    element: <AppLayout />,
    errorElement: <RouteError />,
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
            element: <VenueListPage />
          },
          {
            path: ROUTE_PATTERNS.ADMIN_VENUE_CREATE,
            element: <VenueCreatePage />
          },
          {
            path: ROUTE_PATTERNS.ADMIN_VENUE_DETAIL,
            element: <VenueDetailPage />
          },
          {
            path: ROUTE_PATTERNS.ADMIN_VENUE_EDIT,
            element: <VenueEditPage />
          },
          {
            path: ROUTE_PATTERNS.ADMIN_MERCHANTS,
            element: <MerchantListPage />
          },
          {
            path: ROUTE_PATTERNS.ADMIN_MERCHANT_CREATE,
            element: <MerchantCreatePage />
          },
          {
            path: ROUTE_PATTERNS.ADMIN_MERCHANT_DETAIL,
            element: <MerchantDetailPage />
          },
          {
            path: ROUTE_PATTERNS.ADMIN_MERCHANT_EDIT,
            element: <MerchantEditPage />
          },
          {
            path: ROUTE_PATTERNS.ADMIN_CATEGORIES,
            element: <CategoryListPage />
          },
          {
            path: ROUTE_PATTERNS.ADMIN_CATEGORY_CREATE,
            element: <CategoryCreatePage />
          },
          {
            path: ROUTE_PATTERNS.ADMIN_CATEGORY_EDIT,
            element: <CategoryEditPage />
          },
          {
            path: ROUTE_PATTERNS.ADMIN_ORDERS,
            element: <OrderListPage />
          },
          {
            path: ROUTE_PATTERNS.ADMIN_ORDER_DETAIL,
            element: <OrderDetailPage />
          },
          {
            path: ROUTE_PATTERNS.ADMIN_PAYOUTS,
            element: <PayoutsPage />
          }
        ]
      },
      {
        element: <RequireRole role="merchant" />,
        children: [
          {
            path: ROUTE_PATTERNS.MERCHANT_HOME,
            element: <MerchantCabinetPage />
          },
          {
            path: ROUTE_PATTERNS.MERCHANT_VENUE_EDIT,
            element: <OwnVenueEditPage />
          },
          {
            path: ROUTE_PATTERNS.MERCHANT_SUMMARY,
            element: <MerchantSummaryPage />
          },
          {
            path: ROUTE_PATTERNS.MERCHANT_CERTIFICATES,
            element: <MerchantCertificatesPage />
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

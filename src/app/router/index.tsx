import { createBrowserRouter } from "react-router";

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
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

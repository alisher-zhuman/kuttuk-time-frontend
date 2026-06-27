import { createBrowserRouter, Navigate } from "react-router";

import { HomePage } from "@pages/home";
import { MerchantPage } from "@pages/merchant";
import { NotFoundPage } from "@pages/not-found";
import { ProfilePage } from "@pages/profile";

import { AppLayout } from "@widgets/layout";

import { ROUTES } from "@shared/constants";

export const ROUTER = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={ROUTES.HOME} replace />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: ROUTES.HOME,
        element: <HomePage />,
      },
      {
        path: ROUTES.PROFILE,
        element: <ProfilePage />,
      },
      {
        path: ROUTES.MERCHANT,
        element: <MerchantPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

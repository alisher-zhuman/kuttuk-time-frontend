import { createBrowserRouter, Navigate } from "react-router";

import { HomePage } from "@pages/home";
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
    ],
  },
]);

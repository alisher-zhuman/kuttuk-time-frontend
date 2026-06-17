import { createBrowserRouter, Navigate } from "react-router";

import { HomePage } from "@pages/home";
import { ProfilePage } from "@pages/profile";

import { ROUTES } from "@shared/constants";

export const ROUTER = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={ROUTES.HOME} replace />,
  },
  {
    path: ROUTES.HOME,
    element: <HomePage />,
  },
  {
    path: ROUTES.PROFILE,
    element: <ProfilePage />,
  },
]);

import { createBrowserRouter, Navigate } from "react-router";

import { HomePage } from "@pages/home";
import { ProfilePage } from "@pages/profile";

export const ROUTER = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/app" replace />,
  },
  {
    path: "/app",
    element: <HomePage />,
  },
  {
    path: "/app/profile",
    element: <ProfilePage />,
  },
]);

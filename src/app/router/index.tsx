import { createBrowserRouter, Navigate } from "react-router";

import { HomePage } from "@pages/home";

export const ROUTER = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/app" replace />,
  },
  {
    path: "/app",
    element: <HomePage />,
  },
]);

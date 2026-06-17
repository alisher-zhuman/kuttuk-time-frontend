import { createBrowserRouter } from "react-router";

import { HomePage } from "@pages/home";

export const ROUTER = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
]);

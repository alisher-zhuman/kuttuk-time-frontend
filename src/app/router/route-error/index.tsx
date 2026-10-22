import { useEffect } from "react";
import { useRouteError } from "react-router";

import { Fallback } from "../../providers/error-boundary/fallback";

// A render error inside a route: React Router catches it before the app's
// ErrorBoundary, and without this its default English screen shows.
export const RouteError = () => {
  const error = useRouteError();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return <Fallback onReload={() => window.location.reload()} />;
};

import { useLayoutEffect } from "react";
import { useLocation } from "react-router";

import { useNavigateTo } from "@shared/hooks";

// The website opened on an old /app/... address of a public page (a link
// shared before the pages moved to the root): the same page at its public
// address, in place of this history entry. useNavigateTo does the mapping.
export const SiteRedirect = () => {
  const { pathname, search } = useLocation();

  const navigateTo = useNavigateTo();

  useLayoutEffect(() => {
    navigateTo(pathname + search, { replace: true });
  }, [navigateTo, pathname, search]);

  return null;
};

import { useCallback } from "react";
import { useNavigate } from "react-router";

import i18n from "i18next";

import { toSitePath, withSiteLanguage } from "@shared/constants";
import { isWebsite } from "@shared/store";

// On the website ROUTE_PATTERNS' /app/... become the public addresses
// (/venues/sierra) and keep the reader's language (?lang=kg).
const resolve = (to: string) => {
  if (!isWebsite()) return to;

  const [path = "", search] = to.split("?");

  return withSiteLanguage(toSitePath(path) + (search ? `?${search}` : ""), i18n.language);
};

export const useNavigateTo = () => {
  const navigate = useNavigate();

  // Current path is read at call time, not via useLocation(): that would give
  // navigateTo a new identity on every route change and re-run every effect
  // depending on it (e.g. useSettingsButton remounting the button).
  return useCallback(
    (to: string | number, options?: { replace?: boolean }) => {
      if (typeof to === "number") {
        void navigate(to);
      } else {
        const target = resolve(to);
        // Compare without the query string: /profile → /profile?tab=settings
        // is the same page and must not stack a history entry.
        const [path] = target.split("?");

        void navigate(target, {
          replace: options?.replace ?? window.location.pathname === path
        });
      }
    },
    [navigate]
  );
};

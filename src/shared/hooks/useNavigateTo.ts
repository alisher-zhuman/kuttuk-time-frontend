import { useCallback } from "react";
import { useNavigate } from "react-router";

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
        // Compare without the query string: /profile → /profile?tab=settings
        // is the same page and must not stack a history entry.
        const [path] = to.split("?");

        void navigate(to, {
          replace: options?.replace ?? window.location.pathname === path
        });
      }
    },
    [navigate]
  );
};

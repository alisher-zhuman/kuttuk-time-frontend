import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";

export const useNavigateTo = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return useCallback(
    (to: string | number, options?: { replace?: boolean }) => {
      if (typeof to === "number") {
        void navigate(to);
      } else {
        // Compare without the query string: /profile → /profile?tab=settings
        // is the same page and must not stack a history entry.
        const [path] = to.split("?");

        void navigate(to, { replace: options?.replace ?? pathname === path });
      }
    },
    [navigate, pathname]
  );
};

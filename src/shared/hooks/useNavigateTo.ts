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
        void navigate(to, { replace: options?.replace ?? pathname === to });
      }
    },
    [navigate, pathname],
  );
};

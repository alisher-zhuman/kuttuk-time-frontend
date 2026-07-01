import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";

export const useNavigateTo = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return useCallback(
    (to: string, options?: { replace?: boolean }) => {
      void navigate(to, { replace: options?.replace ?? pathname === to });
    },
    [navigate, pathname],
  );
};

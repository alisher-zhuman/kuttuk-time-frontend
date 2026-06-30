import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router";

export const useNavigateTo = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return useCallback(
    (to: string) => {
      void navigate(to, { replace: pathname === to });
    },
    [navigate, pathname],
  );
};

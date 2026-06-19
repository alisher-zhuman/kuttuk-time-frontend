import { useLocation, useNavigate } from "react-router";

export const useNavigateTo = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (to: string) => {
    void navigate(to, { replace: pathname === to });
  };
};

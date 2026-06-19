import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import { backButton } from "@tma.js/sdk-react";

import { ROUTES } from "@shared/constants";

export const useBackButton = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!backButton.mount.isAvailable()) return;

    backButton.mount();

    return () => backButton.unmount();
  }, []);

  useEffect(() => {
    if (!backButton.mount.isAvailable()) return;

    if (pathname === ROUTES.HOME) {
      backButton.hide();
      return;
    }

    backButton.show();

    const off = backButton.onClick(() => void navigate(-1));

    return () => off();
  }, [pathname, navigate]);
};

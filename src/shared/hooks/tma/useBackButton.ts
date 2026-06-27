import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

import { backButton } from "@tma.js/sdk-react";

import { ROUTE_PATTERNS } from "@shared/constants";

import { useHaptic } from "./useHaptic";

export const useBackButton = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  const haptic = useHaptic();

  useEffect(() => {
    if (!backButton.mount.isAvailable()) return;

    backButton.mount();

    return () => backButton.unmount();
  }, []);

  useEffect(() => {
    if (!backButton.mount.isAvailable()) return;

    if (pathname === ROUTE_PATTERNS.HOME) {
      backButton.hide();
      return;
    }

    backButton.show();

    const off = backButton.onClick(() => { haptic.light(); void navigate(-1); });

    return () => off();
  }, [pathname, navigate, haptic]);
};

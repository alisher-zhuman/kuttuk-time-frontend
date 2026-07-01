import { useEffect } from "react";
import { NavigationType, useLocation, useNavigationType } from "react-router";

import { backButton } from "@tma.js/sdk-react";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useNavigateTo } from "@shared/hooks";

import { useHaptic } from "./useHaptic";

export const useBackButton = () => {
  const navigationType = useNavigationType();
  const { pathname } = useLocation();
  const navigateTo = useNavigateTo();

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

    const off = backButton.onClick(() => {
      haptic.light();

      if (navigationType === NavigationType.Replace) {
        navigateTo(ROUTE_PATTERNS.HOME);
      } else {
        navigateTo(-1);
      }
    });

    return () => off();
  }, [pathname, navigateTo, haptic, navigationType]);
};

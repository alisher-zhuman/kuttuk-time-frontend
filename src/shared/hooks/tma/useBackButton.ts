import { useEffect } from "react";
import { useLocation } from "react-router";

import { backButton } from "@tma.js/sdk-react";

import { ROUTE_PATTERNS } from "@shared/constants";
import { canGoBack } from "@shared/helpers";
import { useNavigateTo } from "@shared/hooks";
import { useViewModeStore } from "@shared/store";

import { useHaptic } from "./useHaptic";

const ROOT_PATHS: string[] = [
  ROUTE_PATTERNS.HOME,
  ROUTE_PATTERNS.ADMIN_MERCHANTS,
  ROUTE_PATTERNS.ADMIN_ORDERS,
  ROUTE_PATTERNS.ADMIN_PAYMENTS
];

export const useBackButton = () => {
  const { pathname } = useLocation();
  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const viewMode = useViewModeStore((s) => s.viewMode);

  useEffect(() => {
    if (!backButton.mount.isAvailable()) return;

    backButton.mount();

    return () => backButton.unmount();
  }, []);

  useEffect(() => {
    if (!backButton.mount.isAvailable()) return;

    if (ROOT_PATHS.includes(pathname)) {
      backButton.hide();
      return;
    }

    backButton.show();

    const homeRoute =
      viewMode === "admin" ? ROUTE_PATTERNS.ADMIN_MERCHANTS : ROUTE_PATTERNS.HOME;

    const off = backButton.onClick(() => {
      haptic.light();

      if (canGoBack()) {
        navigateTo(-1);
      } else {
        navigateTo(homeRoute);
      }
    });

    return () => off();
  }, [pathname, navigateTo, haptic, viewMode]);
};

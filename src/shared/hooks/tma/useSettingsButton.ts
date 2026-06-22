import { useEffect } from "react";

import { settingsButton } from "@tma.js/sdk-react";

import { ROUTES } from "@shared/constants";
import { useNavigateTo } from "@shared/hooks";

import { useHaptic } from "./useHaptic";

export const useSettingsButton = () => {
  const navigateTo = useNavigateTo();
  
  const haptic = useHaptic();

  useEffect(() => {
    if (!settingsButton.mount.isAvailable()) return;

    settingsButton.mount();
    settingsButton.show();

    const off = settingsButton.onClick(() => {
      haptic.light();
      navigateTo(ROUTES.PROFILE);
    });

    return () => {
      off();
      settingsButton.unmount();
    };
  }, [navigateTo, haptic]);
};

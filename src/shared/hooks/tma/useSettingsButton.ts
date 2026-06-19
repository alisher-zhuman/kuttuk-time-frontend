import { useEffect } from "react";
import { useNavigate } from "react-router";

import { settingsButton } from "@tma.js/sdk-react";

import { ROUTES } from "@shared/constants";

export const useSettingsButton = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!settingsButton.mount.isAvailable()) return;

    settingsButton.mount();
    settingsButton.show();

    const off = settingsButton.onClick(() => {
      void navigate(ROUTES.PROFILE);
    });

    return () => {
      off();
      settingsButton.unmount();
    };
  }, [navigate]);
};

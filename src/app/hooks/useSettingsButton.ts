import { useEffect } from "react";
import { useNavigate } from "react-router";

import { settingsButton } from "@tma.js/sdk-react";

export const useSettingsButton = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!settingsButton.mount.isAvailable()) return;

    settingsButton.mount();
    settingsButton.show();

    const off = settingsButton.onClick(() => {
      void navigate("/app/profile");
    });

    return () => {
      off();
      settingsButton.unmount();
    };
  }, [navigate]);
};

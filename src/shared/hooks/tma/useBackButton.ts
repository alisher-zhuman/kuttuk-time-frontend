import { useEffect } from "react";

import { backButton } from "@tma.js/sdk-react";

import { useGoBack } from "../useGoBack";
import { useHaptic } from "./useHaptic";

export const useBackButton = () => {
  const haptic = useHaptic();

  const { isRoot, goBack } = useGoBack();

  useEffect(() => {
    if (!backButton.mount.isAvailable()) return;

    backButton.mount();

    return () => backButton.unmount();
  }, []);

  useEffect(() => {
    if (!backButton.mount.isAvailable()) return;

    if (isRoot) {
      backButton.hide();
      return;
    }

    backButton.show();

    const off = backButton.onClick(() => {
      haptic.light();
      goBack();
    });

    return () => off();
  }, [isRoot, goBack, haptic]);
};

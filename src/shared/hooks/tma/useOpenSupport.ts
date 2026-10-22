import { useCallback } from "react";

import { openTelegramLink } from "@tma.js/sdk-react";

import { SUPPORT_URL } from "@shared/constants";

import { useHaptic } from "./useHaptic";

// Opens the support chat in Telegram. canOpen is false outside Telegram's
// link support — callers hide their button then.
export const useOpenSupport = () => {
  const haptic = useHaptic();

  const open = useCallback(() => {
    haptic.light();

    if (openTelegramLink.isAvailable()) {
      openTelegramLink(SUPPORT_URL);
    }
  }, [haptic]);

  return { canOpen: openTelegramLink.isAvailable(), open };
};

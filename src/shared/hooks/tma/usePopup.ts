import { useCallback } from "react";

import { popup, type ShowOptionsButton } from "@tma.js/sdk-react";

interface Options {
  title?: string;
  message: string;
  buttons?: ShowOptionsButton[];
}

export const usePopup = () =>
  useCallback(async (options: Options) => {
    if (!popup.show.isAvailable()) return null;

    try {
      return (await popup.show(options)) ?? null;
    } catch {
      return null;
    }
  }, []);

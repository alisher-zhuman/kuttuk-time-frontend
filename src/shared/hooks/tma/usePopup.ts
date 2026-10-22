import { useCallback } from "react";

import { popup, type ShowOptionsButton } from "@tma.js/sdk-react";

interface Options {
  title?: string;
  message: string;
  buttons?: ShowOptionsButton[];
}

// Resolves to the pressed button's id; null — closed without a choice;
// undefined — the popup couldn't open (no popup support, or Telegram rejected
// the params, e.g. a message over 256 characters).
export const usePopup = () =>
  useCallback(async (options: Options): Promise<string | null | undefined> => {
    if (!popup.show.isAvailable()) return undefined;

    try {
      return (await popup.show(options)) ?? null;
    } catch {
      return undefined;
    }
  }, []);

import { useCallback } from "react";

import { popup, type ShowOptionsButton } from "@tma.js/sdk-react";

import { isWebsite } from "@shared/store";

interface Options {
  title?: string;
  message: string;
  buttons?: ShowOptionsButton[];
}

// The website: the browser's own dialogs - a confirm when there's a choice
// (OK = the first non-cancel button), else a plain alert.
const showInBrowser = ({ title, message, buttons = [] }: Options): string | null => {
  const text = title ? `${title}\n\n${message}` : message;
  const action = buttons.find((button) => button.type !== "cancel" && button.type !== "close");

  if (action && buttons.length > 1) {
    return window.confirm(text) ? (action.id ?? null) : null;
  }

  window.alert(text);

  return action?.id ?? null;
};

// Resolves to the pressed button's id; null - closed without a choice;
// undefined - the popup couldn't open (no popup support, or Telegram rejected
// the params, e.g. a message over 256 characters).
export const usePopup = () =>
  useCallback(async (options: Options): Promise<string | null | undefined> => {
    if (isWebsite()) return showInBrowser(options);

    if (!popup.show.isAvailable()) return undefined;

    try {
      return (await popup.show(options)) ?? null;
    } catch {
      return undefined;
    }
  }, []);

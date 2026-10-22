import { useCallback } from "react";

import { qrScanner } from "@tma.js/sdk-react";

// Telegram's native QR scanner (Mini Apps 6.4+; not on desktop clients).
// accept: which QR texts close the scanner — anything else is ignored and the
// scanner stays open, so a stray QR nearby doesn't cut the scan short.
// scan resolves to the accepted text, or undefined if closed / unavailable.
export const useQrScanner = () => {
  const scan = useCallback(async (accept: (text: string) => boolean, text?: string) => {
    if (!qrScanner.capture.isAvailable()) return undefined;

    try {
      return await qrScanner.capture({ ...(text && { text }), capture: accept });
    } catch {
      return undefined;
    }
  }, []);

  return { isAvailable: qrScanner.capture.isAvailable(), scan };
};

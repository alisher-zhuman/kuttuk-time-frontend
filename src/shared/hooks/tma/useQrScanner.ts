import { useCallback } from "react";

import { qrScanner } from "@tma.js/sdk-react";

// Telegram's native QR scanner (Mini Apps 6.4+; not on desktop clients).
// scan resolves to the scanned text, or undefined if closed / unavailable.
// The first QR read is taken as is — the caller decides whether it fits.
export const useQrScanner = () => {
  const scan = useCallback(async (text?: string) => {
    if (!qrScanner.capture.isAvailable()) return undefined;

    try {
      return await qrScanner.capture({ ...(text && { text }), capture: () => true });
    } catch {
      return undefined;
    }
  }, []);

  return { isAvailable: qrScanner.capture.isAvailable(), scan };
};

import { useCallback } from "react";

import { copyTextToClipboard } from "@tma.js/sdk-react";

export const useCopyToClipboard = () =>
  useCallback(async (text: string) => {
    try {
      await copyTextToClipboard(text);
      return true;
    } catch {
      return false;
    }
  }, []);

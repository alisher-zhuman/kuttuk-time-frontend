import { type ReactNode, useEffect } from "react";

import { init, viewport } from "@tma.js/sdk-react";

try {
  init();
} catch {
  console.warn('TMA SDK: running outside Telegram');
}

interface Props {
  children: ReactNode;
}

export const TMAProvider = ({ children }: Props) => {
  useEffect(() => {
    if (viewport.mount.isAvailable()) {
      void viewport.mount();
    }
  }, []);

  return <>{children}</>;
};

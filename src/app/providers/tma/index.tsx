import { type ReactNode, useEffect } from "react";

import { init, miniApp, viewport } from "@tma.js/sdk-react";

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
    if (miniApp.mount.isAvailable()) {
      miniApp.mount();
      miniApp.setHeaderColor('#FFFFFF');
      miniApp.setBgColor('#F4F5F7');
      miniApp.ready();
    }

    if (viewport.mount.isAvailable()) {
      void viewport.mount().then(() => {
        viewport.expand();
      });
    }
  }, []);

  return <>{children}</>;
};

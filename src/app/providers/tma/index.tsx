import { type ReactNode, useEffect } from "react";

import { init, miniApp, swipeBehavior, themeParams, viewport } from "@tma.js/sdk-react";

try {
  init();
} catch {
  console.warn('TMA SDK: running outside Telegram');
}

interface Props {
  children: ReactNode;
}

const SafeArea = ({ children }: Props) => {
  const insets = viewport.contentSafeAreaInsets();

  return (
    <div style={{
      paddingTop: insets.top,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
    }}>
      {children}
    </div>
  );
};

export const TMAProvider = ({ children }: Props) => {
  useEffect(() => {
    if (themeParams.mount.isAvailable()) {
      themeParams.mount();
    }

    if (miniApp.mount.isAvailable()) {
      miniApp.mount();
      miniApp.setHeaderColor('#FFFFFF');
      miniApp.setBgColor('#F4F5F7');
      miniApp.ready();
    }

    if (swipeBehavior.mount.isAvailable()) {
      swipeBehavior.mount();
      swipeBehavior.disableVertical();
    }

    if (viewport.mount.isAvailable()) {
      void viewport.mount().then(() => {
        viewport.bindCssVars();

        if (viewport.requestFullscreen.isAvailable()) {
          void viewport.requestFullscreen();
        }
      });
    }
  }, []);

  return <SafeArea>{children}</SafeArea>;
};

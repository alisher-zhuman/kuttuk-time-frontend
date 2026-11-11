import { useEffect } from "react";

import { mainButton, type RGB, themeParams, useSignal } from "@tma.js/sdk-react";

import { useAppModeStore, useThemeStore, useWebMainButtonStore } from "@shared/store";

interface Options {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  hidden?: boolean;
}

const cssVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() as RGB;

export const useMainButton = ({
  text,
  onClick,
  disabled = false,
  loading = false,
  hidden = false
}: Options) => {
  const theme = useThemeStore((s) => s.theme);

  const isWeb = useAppModeStore((s) => s.mode === "web");

  const isTelegramDark = useSignal(themeParams.isDark);

  // The website: the same action as a plain button the layout draws.
  useEffect(() => {
    if (!isWeb) return;

    const { setButton } = useWebMainButtonStore.getState();

    setButton(hidden ? null : { text, onClick, disabled, loading });

    return () => setButton(null);
  }, [isWeb, hidden, text, onClick, disabled, loading]);

  useEffect(() => {
    if (isWeb || !mainButton.mount.isAvailable()) return;

    mainButton.mount();

    return () => {
      mainButton.hide();
      mainButton.unmount();
    };
  }, [isWeb]);

  useEffect(() => {
    if (isWeb || !mainButton.mount.isAvailable()) return;

    if (hidden) {
      mainButton.hide();
    } else {
      mainButton.show();
    }
  }, [isWeb, hidden]);

  useEffect(() => {
    if (isWeb || !mainButton.mount.isAvailable()) return;

    mainButton.setParams({
      bgColor: cssVar("--color-primary"),
      textColor: cssVar("--color-card")
    });
  }, [isWeb, theme, isTelegramDark]);

  useEffect(() => {
    if (isWeb || !mainButton.mount.isAvailable()) return;

    mainButton.setText(text);
  }, [isWeb, text]);

  useEffect(() => {
    if (isWeb || !mainButton.mount.isAvailable()) return;

    // The loader alone doesn't stop taps - disable the button while loading.
    if (disabled || loading) {
      mainButton.disable();
    } else {
      mainButton.enable();
    }
  }, [isWeb, disabled, loading]);

  useEffect(() => {
    if (isWeb || !mainButton.mount.isAvailable()) return;

    if (loading) {
      mainButton.showLoader();
    } else {
      mainButton.hideLoader();
    }
  }, [isWeb, loading]);

  useEffect(() => {
    if (isWeb || !mainButton.mount.isAvailable()) return;

    const off = mainButton.onClick(onClick);

    return () => off();
  }, [isWeb, onClick]);
};

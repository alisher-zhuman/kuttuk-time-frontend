import { useEffect } from "react";

import { mainButton, type RGB } from "@tma.js/sdk-react";

import { useThemeStore } from "@shared/store";

interface Options {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

const cssVar = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() as RGB;

export const useMainButton = ({
  text,
  onClick,
  disabled = false,
  loading = false,
}: Options) => {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    if (!mainButton.mount.isAvailable()) return;

    mainButton.mount();
    mainButton.show();

    return () => {
      mainButton.hide();
      mainButton.unmount();
    };
  }, []);

  useEffect(() => {
    if (!mainButton.mount.isAvailable()) return;

    mainButton.setParams({
      bgColor: cssVar("--color-primary"),
      textColor: cssVar("--color-card"),
    });
  }, [theme]);

  useEffect(() => {
    if (!mainButton.mount.isAvailable()) return;

    mainButton.setText(text);
  }, [text]);

  useEffect(() => {
    if (!mainButton.mount.isAvailable()) return;

    if (disabled) {
      mainButton.disable();
    } else {
      mainButton.enable();
    }
  }, [disabled]);

  useEffect(() => {
    if (!mainButton.mount.isAvailable()) return;

    if (loading) {
      mainButton.showLoader();
    } else {
      mainButton.hideLoader();
    }
  }, [loading]);

  useEffect(() => {
    if (!mainButton.mount.isAvailable()) return;

    const off = mainButton.onClick(onClick);

    return () => off();
  }, [onClick]);
};

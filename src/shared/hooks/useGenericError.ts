import { useCallback } from "react";

import { useTranslation } from "react-i18next";

import { useHaptic, usePopup } from "./tma";

export const useGenericError = () => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  const showPopup = usePopup();

  return useCallback(() => {
    haptic.error();

    void showPopup({
      title: t("errors.genericTitle"),
      message: t("errors.generic")
    });
  }, [haptic, showPopup, t]);
};

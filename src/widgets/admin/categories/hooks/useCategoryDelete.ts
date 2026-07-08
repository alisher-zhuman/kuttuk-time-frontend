import { useTranslation } from "react-i18next";

import { useDeleteCategoryMutation } from "@entities/category";

import { useHaptic, usePopup } from "@shared/hooks";

export const useCategoryDelete = () => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  const showPopup = usePopup();

  const { mutate: remove } = useDeleteCategoryMutation();

  const handleDelete = async (id: number) => {
    const buttonId = await showPopup({
      title: t("admin.categories.deleteConfirmTitle"),
      message: t("admin.categories.deleteConfirmMessage"),
      buttons: [
        { id: "cancel", type: "cancel" },
        { id: "delete", type: "destructive", text: t("admin.categories.delete") }
      ]
    });

    if (buttonId !== "delete") return;

    remove(id, {
      onSuccess: () => {
        haptic.success();
      },
      onError: () => {
        haptic.error();
        showPopup({
          title: t("errors.genericTitle"),
          message: t("errors.generic")
        });
      }
    });
  };

  return { handleDelete };
};

import { useTranslation } from "react-i18next";

import { move } from "@dnd-kit/helpers";
import type { DragEndEvent } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";

import {
  type AdminCategory,
  useReorderCategoriesMutation
} from "@entities/category";

import { useHaptic, usePopup } from "@shared/hooks";

export const useCategoryReorder = (categories: AdminCategory[]) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  const showPopup = usePopup();

  const { mutate: reorder } = useReorderCategoriesMutation();

  const handleDragStart = () => {
    haptic.medium();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) return;

    const { source } = event.operation;

    if (!isSortable(source) || source.initialIndex === source.index) return;

    haptic.selection();

    reorder(
      move(categories, event).map((category) => category.id),
      {
        onError: () => {
          haptic.error();
          showPopup({
            title: t("errors.genericTitle"),
            message: t("errors.generic")
          });
        }
      }
    );
  };

  return { handleDragStart, handleDragEnd };
};

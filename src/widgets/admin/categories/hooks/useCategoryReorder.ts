import { move } from "@dnd-kit/helpers";
import type { DragEndEvent } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";

import {
  type AdminCategory,
  useReorderCategoriesMutation
} from "@entities/category";

import { useGenericError, useHaptic } from "@shared/hooks";

export const useCategoryReorder = (categories: AdminCategory[]) => {
  const haptic = useHaptic();

  const showGenericError = useGenericError();

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
      { onError: showGenericError }
    );
  };

  return { handleDragStart, handleDragEnd };
};

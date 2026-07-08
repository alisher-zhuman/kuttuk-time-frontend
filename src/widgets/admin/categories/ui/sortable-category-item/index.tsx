import { type RefObject } from "react";

import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers";
import { RestrictToElement } from "@dnd-kit/dom/modifiers";
import { useSortable } from "@dnd-kit/react/sortable";

import { type AdminCategory, AdminCategoryCard } from "@entities/category";

interface Props {
  category: AdminCategory;
  index: number;
  listRef: RefObject<HTMLUListElement | null>;
  onClick: () => void;
}

export const SortableCategoryItem = ({
  category,
  index,
  listRef,
  onClick
}: Props) => {
  const { ref, handleRef, isDragging } = useSortable({
    id: category.id,
    index,
    modifiers: [
      RestrictToVerticalAxis,
      // eslint-disable-next-line react-hooks/refs -- dnd-kit calls this lazily during an active drag, never during render
      RestrictToElement.configure({ element: () => listRef.current })
    ]
  });

  return (
    <li ref={ref}>
      <AdminCategoryCard
        category={category}
        onClick={onClick}
        handleRef={handleRef}
        isDragging={isDragging}
      />
    </li>
  );
};

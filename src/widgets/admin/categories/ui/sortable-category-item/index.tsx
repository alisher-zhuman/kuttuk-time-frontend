import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers";
import { RestrictToElement } from "@dnd-kit/dom/modifiers";
import { useSortable } from "@dnd-kit/react/sortable";

import { type AdminCategory, AdminCategoryCard } from "@entities/category";

interface Props {
  category: AdminCategory;
  index: number;
  listElement: HTMLUListElement | null;
  onClick: () => void;
}

export const SortableCategoryItem = ({
  category,
  index,
  listElement,
  onClick
}: Props) => {
  const { ref, handleRef, isDragging } = useSortable({
    id: category.id,
    index,
    modifiers: [
      RestrictToVerticalAxis,
      RestrictToElement.configure({ element: listElement })
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

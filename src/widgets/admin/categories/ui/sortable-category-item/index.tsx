import { useSortable } from "@dnd-kit/react/sortable";

import { type AdminCategory, AdminCategoryCard } from "@entities/category";

interface Props {
  category: AdminCategory;
  index: number;
  onClick: () => void;
}

export const SortableCategoryItem = ({ category, index, onClick }: Props) => {
  const { ref, handleRef, isDragging } = useSortable({
    id: category.id,
    index,
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

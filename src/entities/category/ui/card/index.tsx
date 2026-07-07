import type { Category } from "../../model/types";

interface Props {
  category: Category;
}

export const CategoryCard = ({ category }: Props) => (
  <div className="w-full bg-(--color-card) rounded-2xl px-4 py-3 border border-(--color-line) flex items-center gap-3">
    <span className="flex-1 min-w-0 text-base font-bold text-(--color-ink) truncate">
      {category.name}
    </span>
  </div>
);

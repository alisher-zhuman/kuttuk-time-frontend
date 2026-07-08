import { useTranslation } from "react-i18next";

import type { AdminCategory } from "../../../model/types";

interface Props {
  category: AdminCategory;
}

export const AdminCategoryCard = ({ category }: Props) => {
  const { i18n } = useTranslation();

  const name = category.name[i18n.language as keyof typeof category.name];

  return (
    <div className="w-full bg-(--color-card) rounded-2xl px-4 py-3 border border-(--color-line) flex items-center gap-3">
      <span className="flex-1 min-w-0 text-base font-bold text-(--color-ink) truncate">
        {name}
      </span>
    </div>
  );
};

import { useTranslation } from "react-i18next";

import { ChevronRight } from "lucide-react";

import type { AdminCategory } from "../../../model/types";

interface Props {
  category: AdminCategory;
  onClick: () => void;
}

export const AdminCategoryCard = ({ category, onClick }: Props) => {
  const { i18n } = useTranslation();

  const name = category.name[i18n.language as keyof typeof category.name];

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-(--color-card) rounded-2xl px-4 py-3 border border-(--color-line) flex items-center gap-3 cursor-pointer"
    >
      <span className="flex-1 min-w-0 text-base font-bold text-(--color-ink) truncate text-left">
        {name}
      </span>

      <ChevronRight size={18} className="text-(--color-hint) shrink-0" />
    </button>
  );
};

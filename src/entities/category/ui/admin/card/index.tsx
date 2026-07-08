import { useTranslation } from "react-i18next";

import { GripVertical, Pencil } from "lucide-react";

import { cn } from "@shared/helpers";

import type { AdminCategory } from "../../../model/types";

interface Props {
  category: AdminCategory;
  onClick: () => void;
  handleRef: (element: Element | null) => void;
  isDragging: boolean;
}

export const AdminCategoryCard = ({
  category,
  onClick,
  handleRef,
  isDragging
}: Props) => {
  const { t, i18n } = useTranslation();

  const name = category.name[i18n.language as keyof typeof category.name];

  return (
    <div
      className={cn(
        "w-full bg-(--color-card) rounded-2xl px-4 py-3 border border-(--color-line) flex items-center gap-2",
        isDragging && "shadow-lg"
      )}
    >
      <span className="flex-1 min-w-0 text-base font-bold text-(--color-ink) truncate">
        {name}
      </span>

      <button
        type="button"
        onClick={onClick}
        aria-label={t("admin.categories.edit")}
        className="shrink-0 p-2 -m-2 text-(--color-hint) cursor-pointer"
      >
        <Pencil size={16} />
      </button>

      <button
        type="button"
        ref={handleRef}
        aria-label={t("admin.categories.reorder")}
        className="shrink-0 p-2 -m-2 touch-none text-(--color-hint) cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={18} />
      </button>
    </div>
  );
};

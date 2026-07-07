import { useTranslation } from "react-i18next";

import { Plus } from "lucide-react";

import { useCategoriesQuery } from "@entities/category";

import { cn } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";

interface Props {
  active: number | null;
  onChange: (categoryId: number | null) => void;
  onCreate?: () => void;
}

export const CategoryFilter = ({ active, onChange, onCreate }: Props) => {
  const haptic = useHaptic();

  const { t } = useTranslation();

  const { categories } = useCategoriesQuery();

  const items = [
    { id: null, label: t("categories.all") },
    ...categories.map((category) => ({
      id: category.id,
      label: category.name,
    })),
  ];

  const handleSelect = (categoryId: number | null, el: HTMLButtonElement) => {
    haptic.selection();
    onChange(categoryId);
    el.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <nav
      aria-label="Категории"
      className="-mx-4 flex gap-2 mt-3.5 overflow-x-auto"
    >
      {onCreate && (
        <button
          type="button"
          aria-label={t("admin.categories.add")}
          onClick={() => {
            haptic.light();
            onCreate();
          }}
          className="flex items-center justify-center size-9 rounded-full border border-dashed border-(--color-line) text-(--color-hint) shrink-0 cursor-pointer first:ml-4 last:mr-4"
        >
          <Plus size={16} />
        </button>
      )}

      {items.map((item) => (
        <button
          key={item.id ?? "all"}
          type="button"
          aria-pressed={active === item.id}
          onClick={(e) => handleSelect(item.id, e.currentTarget)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150 first:ml-4 last:mr-4",
            active === item.id
              ? "bg-(--color-primary) text-(--color-card) border-none"
              : "bg-(--color-chip) text-(--color-chip-ink) border border-(--color-line)",
          )}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};

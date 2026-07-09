import { useTranslation } from "react-i18next";

import { useCategoriesQuery } from "@entities/category";

import { cn } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";

interface Props {
  value: number[];
  onChange: (categories: number[]) => void;
  error?: string | undefined;
}

export const CategorySelect = ({ value, onChange, error }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  const { categories } = useCategoriesQuery();

  const toggle = (id: number) => {
    haptic.selection();
    onChange(value.includes(id) ? value.filter((item) => item !== id) : [...value, id]);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-(--color-hint)">
        {t("admin.merchants.form.categories")}
      </span>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isSelected = value.includes(category.id);

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => toggle(category.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-bold cursor-pointer border transition-colors duration-150",
                isSelected
                  ? "bg-(--color-primary) text-(--color-card) border-transparent"
                  : "bg-(--color-chip) text-(--color-chip-ink) border-(--color-line)"
              )}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {error && (
        <span className="text-xs font-semibold text-(--color-accent)">{error}</span>
      )}
    </div>
  );
};

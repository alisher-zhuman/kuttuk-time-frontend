import { useTranslation } from "react-i18next";

import { useMerchantsCategoriesQuery } from "@entities/merchant";

import { cn } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";

interface Props {
  active: string;
  onChange: (cat: string) => void;
}

export const CategoryFilter = ({ active, onChange }: Props) => {
  const haptic = useHaptic();

  const { t } = useTranslation();

  const { categories } = useMerchantsCategoriesQuery();

  const all = ["all", ...categories];

  const handleSelect = (cat: string, el: HTMLButtonElement) => {
    haptic.selection();
    onChange(cat);
    el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  return (
    <nav
      aria-label="Категории"
      className="-mx-4 flex gap-2 mt-3.5 overflow-x-auto"
    >
      {all.map((cat) => (
        <button
          key={cat}
          type="button"
          aria-pressed={active === cat}
          onClick={(e) => handleSelect(cat, e.currentTarget)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150 first:ml-4 last:mr-4",
            active === cat
              ? "bg-(--color-primary) text-(--color-card) border-none"
              : "bg-(--color-chip) text-(--color-chip-ink) border border-(--color-line)",
          )}
        >
          {t(`categories.${cat}`, { defaultValue: cat })}
        </button>
      ))}
    </nav>
  );
};

import { CATEGORIES } from "@entities/category";

import { cn } from "@shared/helpers";

interface Props {
  active: string;
  onChange: (cat: string) => void;
}

export const CategoryFilter = ({ active, onChange }: Props) => (
  <nav aria-label="Категории" className="-mx-4 flex gap-2 mt-3.5 overflow-x-auto">
    {CATEGORIES.map((cat) => (
      <button
        key={cat}
        type="button"
        aria-pressed={active === cat}
        onClick={() => onChange(cat)}
        className={cn(
          "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer first:ml-4 last:mr-4",
          active === cat
            ? "bg-(--color-primary) text-(--color-card) border-none"
            : "bg-(--color-chip) text-(--color-chip-ink) border border-(--color-line)",
        )}
      >
        {cat}
      </button>
    ))}
  </nav>
);

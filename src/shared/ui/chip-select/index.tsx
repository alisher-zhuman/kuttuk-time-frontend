import { type ReactNode } from "react";

import { cn } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";

interface ChipSelectItem<T> {
  value: T;
  label: ReactNode;
}

interface Props<T extends string | number> {
  items: ChipSelectItem<T>[];
  isSelected: (value: T) => boolean;
  onSelect: (value: T) => void;
  label?: string;
  error?: string | undefined;
  size?: "sm" | "md";
}

export const ChipSelect = <T extends string | number>({
  items,
  isSelected,
  onSelect,
  label,
  error,
  size = "sm"
}: Props<T>) => {
  const haptic = useHaptic();

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-sm font-semibold text-(--color-hint)">{label}</span>
      )}

      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const selected = isSelected(item.value);

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                haptic.selection();
                onSelect(item.value);
              }}
              className={cn(
                "rounded-full text-sm font-bold cursor-pointer border transition-colors duration-150",
                size === "sm" ? "px-3 py-1.5" : "px-4 py-2",
                selected
                  ? "bg-(--color-primary) text-(--color-card) border-transparent"
                  : "bg-(--color-chip) text-(--color-chip-ink) border-(--color-line)"
              )}
            >
              {item.label}
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

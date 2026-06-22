import { type ReactNode } from "react";

import { cn } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";

interface SegmentedItem<T extends string> {
  value: T;
  label: ReactNode;
}

interface Props<T extends string> {
  items: SegmentedItem<T>[];
  value: T;
  onChange: (value: T) => void;
}

export const SegmentedControl = <T extends string>({
  items,
  value,
  onChange,
}: Props<T>) => {
  const haptic = useHaptic();
  const n = items.length;
  const activeIndex = items.findIndex((item) => item.value === value);

  return (
    <div className="relative flex w-full rounded-xl bg-(--color-surface) p-1 gap-1">
      <div
        className="absolute top-1 bottom-1 left-1 rounded-lg bg-(--color-card) transition-transform duration-200 ease-out"
        style={{
          boxShadow: "var(--shadow-card)",
          width: `calc((100% - ${8 + 4 * (n - 1)}px) / ${n})`,
          transform: `translateX(calc(${activeIndex} * (100% + 4px)))`,
        }}
      />

      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => { haptic.selection(); onChange(item.value); }}
          className={cn(
            "relative z-10 flex flex-1 items-center justify-center py-2 rounded-lg text-sm font-bold transition-colors duration-200 cursor-pointer",
            value === item.value ? "text-(--color-ink)" : "text-(--color-slate)",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

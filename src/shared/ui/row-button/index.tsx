import { type ReactNode } from "react";

import { ChevronRight } from "lucide-react";

import { useHaptic } from "@shared/hooks";

interface Props {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

// A card-wide row that opens something: an icon, the label and a chevron.
export const RowButton = ({ icon, label, onClick }: Props) => {
  const haptic = useHaptic();

  return (
    <button
      type="button"
      onClick={() => {
        haptic.light();
        onClick();
      }}
      className="flex items-center gap-3 p-3 rounded-2xl bg-(--color-card) border border-(--color-line) text-left cursor-pointer"
    >
      <span className="flex items-center justify-center size-10 shrink-0 rounded-xl bg-(--color-primary-tint) text-(--color-primary)">
        {icon}
      </span>

      <span className="flex-1 min-w-0 text-sm font-bold text-(--color-ink)">{label}</span>

      <ChevronRight size={18} className="shrink-0 text-(--color-hint)" />
    </button>
  );
};

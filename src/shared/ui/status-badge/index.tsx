import { cn } from "@shared/helpers";

interface Props {
  active: boolean;
  label: string;
}

export const StatusBadge = ({ active, label }: Props) => (
  <span
    className={cn(
      "flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0",
      active
        ? "bg-(--color-green-tint) text-(--color-green)"
        : "bg-(--color-surface) text-(--color-hint)"
    )}
  >
    <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
    {label}
  </span>
);

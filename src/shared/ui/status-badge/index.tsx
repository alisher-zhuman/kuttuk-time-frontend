import { cn } from "@shared/helpers";

type Tone = "green" | "amber" | "accent" | "slate" | "muted";

const TONES: Record<Tone, string> = {
  green: "bg-(--color-green-tint) text-(--color-green)",
  amber: "bg-(--color-amber-tint) text-(--color-amber)",
  accent: "bg-(--color-accent-tint) text-(--color-accent)",
  slate: "bg-(--color-chip) text-(--color-slate)",
  muted: "bg-(--color-surface) text-(--color-hint)"
};

interface Props {
  label: string;
  // Active / inactive — the common case; tone overrides it.
  active?: boolean;
  tone?: Tone;
}

export const StatusBadge = ({ label, active = false, tone }: Props) => (
  <span
    className={cn(
      "flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0",
      TONES[tone ?? (active ? "green" : "muted")]
    )}
  >
    <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
    {label}
  </span>
);

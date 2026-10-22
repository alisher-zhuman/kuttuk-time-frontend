import { useTranslation } from "react-i18next";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { formatIsoDate } from "@shared/helpers";

interface Props {
  // The shown week (YYYY-MM-DD, Bishkek); undefined while it loads.
  range: { from: string; to: string } | undefined;
  // No "Next" on the current week — the future has nothing yet.
  isCurrent: boolean;
  onShift: (from: string, days: number) => void;
}

// "‹ Prev · 19.10.2026 – 25.10.2026 · Next ›" for weekly reports.
export const WeekSwitcher = ({ range, isCurrent, onShift }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between gap-2">
      <button
        type="button"
        disabled={!range}
        onClick={() => range && onShift(range.from, -7)}
        className="flex items-center gap-1 px-3 py-2 rounded-full bg-(--color-chip) text-sm font-semibold text-(--color-ink) cursor-pointer disabled:opacity-50"
      >
        <ChevronLeft size={16} />
        {t("week.prev")}
      </button>

      <span className="text-sm font-bold text-(--color-slate) text-center">
        {range
          ? t("week.range", { from: formatIsoDate(range.from), to: formatIsoDate(range.to) })
          : "…"}
      </span>

      {range && !isCurrent ? (
        <button
          type="button"
          onClick={() => onShift(range.from, 7)}
          className="flex items-center gap-1 px-3 py-2 rounded-full bg-(--color-chip) text-sm font-semibold text-(--color-ink) cursor-pointer"
        >
          {t("week.next")}
          <ChevronRight size={16} />
        </button>
      ) : (
        <span className="w-20" />
      )}
    </div>
  );
};

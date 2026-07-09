import { useTranslation } from "react-i18next";

import { VALIDITY_PRESETS } from "@shared/constants";
import { cn } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";

interface Props {
  value: number;
  onChange: (months: number) => void;
  error?: string | undefined;
}

export const ValiditySelect = ({ value, onChange, error }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-(--color-hint)">
        {t("admin.merchants.form.validity")}
      </span>

      <div className="flex flex-wrap gap-2">
        {VALIDITY_PRESETS.map((months) => {
          const isSelected = value === months;

          return (
            <button
              key={months}
              type="button"
              onClick={() => {
                haptic.selection();
                onChange(months);
              }}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-bold cursor-pointer transition-colors duration-150",
                isSelected
                  ? "bg-(--color-primary) text-(--color-card)"
                  : "bg-(--color-chip) text-(--color-chip-ink) border border-(--color-line)"
              )}
            >
              {t("admin.merchants.form.months", { months })}
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

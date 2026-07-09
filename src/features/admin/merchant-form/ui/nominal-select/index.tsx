import { useTranslation } from "react-i18next";

import { NOMINAL_PRESETS } from "@shared/constants";
import { cn, formatMoney } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";

interface Props {
  value: number[];
  onChange: (nominals: number[]) => void;
  error?: string | undefined;
}

export const NominalSelect = ({ value, onChange, error }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  const toggle = (nominal: number) => {
    haptic.selection();
    onChange(
      value.includes(nominal)
        ? value.filter((item) => item !== nominal)
        : [...value, nominal].sort((a, b) => a - b)
    );
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-(--color-hint)">
        {t("admin.merchants.form.nominals")}
      </span>

      <div className="flex flex-wrap gap-2">
        {NOMINAL_PRESETS.map((nominal) => {
          const isSelected = value.includes(nominal);

          return (
            <button
              key={nominal}
              type="button"
              onClick={() => toggle(nominal)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-bold cursor-pointer border transition-colors duration-150",
                isSelected
                  ? "bg-(--color-primary) text-(--color-card) border-transparent"
                  : "bg-(--color-chip) text-(--color-chip-ink) border-(--color-line)"
              )}
            >
              {formatMoney(nominal, t("certificate.currency"))}
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

import { useTranslation } from "react-i18next";

import { cn } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";
import { Input } from "@shared/ui";

import { VALIDITY_MAX, VALIDITY_MIN, VALIDITY_PRESETS } from "../../model/schemas";

interface Props {
  value: string;
  onChange: (months: string) => void;
  error?: string | undefined;
}

export const ValidityInput = ({ value, onChange, error }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="number"
        inputMode="numeric"
        min={VALIDITY_MIN}
        max={VALIDITY_MAX}
        label={t("admin.merchants.form.validity")}
        placeholder={t("admin.merchants.form.validityPlaceholder")}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        error={error}
      />

      <div className="flex flex-wrap gap-2">
        {VALIDITY_PRESETS.map((months) => {
          const isSelected = value === String(months);

          return (
            <button
              key={months}
              type="button"
              onClick={() => {
                haptic.selection();
                onChange(String(months));
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
    </div>
  );
};

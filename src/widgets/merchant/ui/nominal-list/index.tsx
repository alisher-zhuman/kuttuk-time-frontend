import { useTranslation } from "react-i18next";

import { Check } from "lucide-react";

import { cn, formatMoney } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";

interface Props {
  nominals: number[];
  selected: number;
  onSelect: (nominal: number) => void;
}

export const NominalList = ({ nominals, selected, onSelect }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  const currency = t("certificate.currency");

  return (
    <div>
      <p className="text-xs font-bold text-(--color-hint) tracking-widest px-1 pb-2.5">
        {t("merchantDetail.nominal")}
      </p>

      <div className="bg-(--color-card) rounded-2xl border border-(--color-line) shadow-xs overflow-hidden">
        {nominals.map((nominal, index) => {
          const isSelected = nominal === selected;
          return (
            <button
              key={nominal}
              type="button"
              onClick={() => {
                haptic.selection();
                onSelect(nominal);
              }}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3.5 cursor-pointer transition-colors",
                index > 0 && "border-t border-(--color-line)",
                isSelected && "bg-(--color-primary-tint)",
              )}
            >
              <span
                className={cn(
                  "text-base",
                  isSelected
                    ? "font-extrabold text-(--color-primary)"
                    : "font-semibold text-(--color-ink)",
                )}
              >
                {formatMoney(nominal, currency)}
              </span>

              {isSelected && (
                <Check
                  size={18}
                  color="var(--color-primary)"
                  strokeWidth={2.5}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

import { useTranslation } from "react-i18next";

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

      <div className="flex flex-wrap gap-2">
        {nominals.map((nominal) => {
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
                "px-4 py-2 rounded-full text-sm font-bold cursor-pointer transition-colors duration-150",
                isSelected
                  ? "bg-(--color-primary) text-(--color-card)"
                  : "bg-(--color-chip) text-(--color-chip-ink) border border-(--color-line)",
              )}
            >
              {formatMoney(nominal, currency)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

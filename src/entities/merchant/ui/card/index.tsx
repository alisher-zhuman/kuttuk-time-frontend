import { useTranslation } from "react-i18next";

import { ChevronRight } from "lucide-react";

import { formatMoney } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";

import type { Merchant } from "../../hooks/useMerchantsQuery";

interface Props {
  merchant: Merchant;
}

export const MerchantCard = ({ merchant }: Props) => {
  const { t } = useTranslation();
  
  const haptic = useHaptic();

  return (
    <button
      type="button"
      onClick={() => haptic.light()}
      aria-label={`${merchant.name}, ${t("merchant.from")} ${formatMoney(merchant.minNominal)}`}
      className="w-full bg-(--color-card) rounded-2xl p-3 border border-(--color-line) shadow-xs flex items-center gap-3.5 text-left cursor-pointer"
    >
      <span className="size-12 rounded-xl shrink-0 bg-(--color-primary) flex items-center justify-center text-(--color-card) text-xl font-extrabold tracking-tight">
        {merchant.name[0]?.toUpperCase()}
      </span>

      <span className="flex-1 min-w-0 flex flex-col">
        <span className="text-base font-extrabold tracking-tight text-(--color-ink)">
          {merchant.name}
        </span>
        <span className="text-sm text-(--color-slate) font-semibold mt-0.5 truncate">
          {merchant.description}
        </span>
      </span>

      <span className="text-right shrink-0 flex flex-col">
        <span className="text-xs text-(--color-hint) font-bold">
          {t("merchant.from")}
        </span>
        <span className="text-sm text-(--color-primary) font-extrabold">
          {formatMoney(merchant.minNominal)}
        </span>
      </span>

      <ChevronRight size={17} color="var(--color-hint)" />
    </button>
  );
};

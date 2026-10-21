import { useTranslation } from "react-i18next";

import { ChevronRight } from "lucide-react";

import { type PayoutWeek } from "@entities/payout";

import { formatMoney } from "@shared/helpers";

interface Props {
  row: PayoutWeek["merchants"][number];
  onOpen: () => void;
}

export const PayoutRow = ({ row, onOpen }: Props) => {
  const { t } = useTranslation();

  const currency = t("certificate.currency");

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full flex items-center gap-3 p-3 rounded-2xl bg-(--color-card) border border-(--color-line) text-left cursor-pointer"
    >
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <span className="text-base font-extrabold tracking-tight text-(--color-ink) truncate">
          {row.merchantName}
        </span>
        <span className="text-xs font-semibold text-(--color-slate)">
          {t("admin.payouts.orders", { count: row.ordersCount })} ·{" "}
          {t("admin.payouts.gross", { amount: formatMoney(row.gross, currency) })}
        </span>
        <span className="text-xs text-(--color-hint)">
          {t("admin.payouts.commission", { amount: formatMoney(row.commission, currency) })}
        </span>
      </div>

      <span className="shrink-0 text-base font-extrabold text-(--color-primary)">
        {formatMoney(row.payout, currency)}
      </span>

      <ChevronRight size={17} color="var(--color-hint)" className="shrink-0" />
    </button>
  );
};

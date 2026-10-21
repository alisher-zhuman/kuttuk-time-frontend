import { useTranslation } from "react-i18next";

import { ChevronRight } from "lucide-react";

import { type PayoutWeek } from "@entities/payout";

import { formatMoney } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";

import { PayoutStatus } from "../payout-status";

interface Props {
  row: PayoutWeek["merchants"][number];
  onOpen: () => void;
  onMarkPaid: () => void;
}

export const PayoutRow = ({ row, onOpen, onMarkPaid }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  const currency = t("certificate.currency");

  return (
    <div className="flex flex-col gap-3 p-3 rounded-2xl bg-(--color-card) border border-(--color-line)">
      <button
        type="button"
        onClick={onOpen}
        className="w-full flex items-center gap-3 text-left cursor-pointer"
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

        <span className="shrink-0 text-base font-extrabold text-(--color-ink)">
          {formatMoney(row.payout, currency)}
        </span>

        <ChevronRight size={17} color="var(--color-hint)" className="shrink-0" />
      </button>

      <PayoutStatus paidOut={row.paidOut} due={row.due} />

      {row.due > 0 && (
        <button
          type="button"
          onClick={() => {
            haptic.light();
            onMarkPaid();
          }}
          className="py-2.5 rounded-xl bg-(--color-primary) text-(--color-card) text-sm font-bold cursor-pointer"
        >
          {t("admin.payouts.markPaid")}
        </button>
      )}
    </div>
  );
};

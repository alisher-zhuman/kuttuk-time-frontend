import { useTranslation } from "react-i18next";

import { ChevronRight } from "lucide-react";

import { type AdminOrder, OrderStatusBadge } from "@entities/order";

import { formatDateTime, formatMoney } from "@shared/helpers";

interface Props {
  order: AdminOrder;
  onOpen: () => void;
}

export const OrderRow = ({ order, onOpen }: Props) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full flex items-center gap-3 p-3 rounded-2xl bg-(--color-card) border border-(--color-line) text-left cursor-pointer"
    >
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-extrabold text-(--color-ink)">
            {formatMoney(order.amount, t("certificate.currency"))}
          </span>
          <OrderStatusBadge status={order.status} />
        </div>
        <span className="text-sm font-bold text-(--color-ink) truncate">{order.venue.name}</span>
        <span className="text-xs text-(--color-hint)">
          {formatDateTime(order.createdAt)}
          {order.status === "paid" && (
            <span className="font-mono font-bold tracking-wider text-(--color-slate)">
              {" · "}
              {order.certificateCode}
            </span>
          )}
          {order.status === "paid" && order.payoutId && (
            <span className="font-bold text-(--color-green)">
              {" · "}
              {t("admin.orders.paidOut")}
            </span>
          )}
        </span>
      </div>

      <ChevronRight size={17} color="var(--color-hint)" className="shrink-0" />
    </button>
  );
};

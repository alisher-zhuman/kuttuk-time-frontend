import { useTranslation } from "react-i18next";

import { cn } from "@shared/helpers";

import type { OrderStatus } from "../../model/types";

// needs_review is the one to notice: it isn't paid out until resolved by hand.
const TONES: Record<OrderStatus, string> = {
  paid: "bg-(--color-green-tint) text-(--color-green)",
  pending: "bg-(--color-chip) text-(--color-slate)",
  needs_review: "bg-(--color-amber-tint) text-(--color-amber)",
  expired: "bg-(--color-surface) text-(--color-hint)",
  refunded: "bg-(--color-accent-tint) text-(--color-accent)"
};

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const { t } = useTranslation();

  return (
    <span
      className={cn(
        "flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shrink-0",
        TONES[status]
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
      {t(`admin.orders.status.${status}`)}
    </span>
  );
};

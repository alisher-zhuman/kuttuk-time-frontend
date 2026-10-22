import { useTranslation } from "react-i18next";

import { StatusBadge } from "@shared/ui";

import type { OrderStatus } from "../../model/types";

// needs_review is the one to notice: it isn't paid out until resolved by hand.
const TONES = {
  paid: "green",
  pending: "slate",
  needs_review: "amber",
  expired: "muted",
  refunded: "accent"
} as const satisfies Record<OrderStatus, string>;

export const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const { t } = useTranslation();

  return <StatusBadge tone={TONES[status]} label={t(`admin.orders.status.${status}`)} />;
};

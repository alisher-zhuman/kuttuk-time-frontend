import { useTranslation } from "react-i18next";

import { type OrderStatus } from "@entities/order";

interface Props {
  status: OrderStatus;
}

const STATUS_KEYS: Record<OrderStatus, string> = {
  paid: "orders.status.paid",
  needs_review: "orders.status.needsReview",
  expired: "orders.status.expired",
  // Only reached once polling gave up on a pending order (the expiry cron
  // hadn't flipped it yet) — same outcome for the user as expired.
  pending: "orders.status.expired"
};

// Placeholder: the paid / expired / needs_review screens are the next step.
export const OrderStatusMessage = ({ status }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex items-center justify-center py-8 text-center">
      <p className="text-base font-semibold text-(--color-ink) max-w-xs">
        {t(STATUS_KEYS[status])}
      </p>
    </div>
  );
};

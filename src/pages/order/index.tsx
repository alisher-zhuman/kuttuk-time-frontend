import { useParams } from "react-router";

import { Loader2 } from "lucide-react";

import {
  OrderExpired,
  OrderNotFound,
  OrderPaid,
  OrderPending,
  OrderRefunded,
  OrderReview
} from "@widgets/order";

import { isOrderId, useOrderPolling } from "@entities/order";
import { useVenueQuery } from "@entities/venue";

export const OrderPage = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const validOrderId = isOrderId(orderId) ? orderId : undefined;

  const { order, isSettled } = useOrderPolling(validOrderId);

  const { venue } = useVenueQuery(order ? String(order.venueId) : undefined);

  if (!validOrderId) {
    return <OrderNotFound />;
  }

  if (!order) {
    // Settled without data = 404/400 (not ours or missing). Otherwise still
    // loading, or polling through a network error / 5xx.
    if (isSettled) {
      return <OrderNotFound />;
    }

    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 size={28} color="var(--color-hint)" className="animate-spin" />
      </div>
    );
  }

  // Still polling: pending, or expired within the late-webhook grace window
  // (the backend cron flips pending → expired right at expiresAt, but a late
  // payment can still turn it into paid). Both read as "checking" until
  // polling settles — showing "expired" first and "paid" a minute later
  // would be confusing.
  if (!isSettled && (order.status === "pending" || order.status === "expired")) {
    return <OrderPending order={order} venueName={venue?.name} />;
  }

  const venueName = venue?.name;

  switch (order.status) {
    case "paid":
      return <OrderPaid order={order} venueName={venueName} />;
    case "needs_review":
      return <OrderReview order={order} venueName={venueName} />;
    case "refunded":
      return <OrderRefunded order={order} venueName={venueName} />;
    // pending here = polling gave up past the grace window before the cron
    // flipped it; for the user that's the same as expired.
    case "pending":
    case "expired":
      return <OrderExpired order={order} venueName={venueName} />;
  }
};

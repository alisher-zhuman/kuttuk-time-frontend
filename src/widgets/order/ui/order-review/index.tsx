import { useTranslation } from "react-i18next";

import { Hourglass } from "lucide-react";

import { type Order } from "@entities/order";

import { OrderResult } from "../order-result";
import { SupportButton } from "../support-button";

interface Props {
  order: Extract<Order, { status: "needs_review" }>;
  venueName: string | undefined;
}

// Money was taken but the amount didn't match — resolved by hand on the
// backend. No technical details for the user, just reassurance and support.
export const OrderReview = ({ order, venueName }: Props) => {
  const { t } = useTranslation();

  return (
    <OrderResult
      icon={<Hourglass size={32} strokeWidth={1.5} />}
      tone="warning"
      title={t("orders.review.title")}
      description={t("orders.review.hint")}
      venueName={venueName}
      amount={order.amount}
    >
      <SupportButton />
    </OrderResult>
  );
};

import { useTranslation } from "react-i18next";

import { Undo2 } from "lucide-react";

import { type Order } from "@entities/order";

import { OrderResult } from "../order-result";
import { SupportButton } from "../support-button";

interface Props {
  order: Extract<Order, { status: "refunded" }>;
  venueName: string | undefined;
}

// A needs_review order resolved by returning the money by hand. Nothing to act
// on in the app — just say so and point to support in case it hasn't arrived.
export const OrderRefunded = ({ order, venueName }: Props) => {
  const { t } = useTranslation();

  return (
    <OrderResult
      icon={<Undo2 size={32} strokeWidth={1.5} />}
      tone="neutral"
      title={t("orders.refunded.title")}
      description={t("orders.refunded.hint")}
      venueName={venueName}
      amount={order.amount}
    >
      <SupportButton />
    </OrderResult>
  );
};

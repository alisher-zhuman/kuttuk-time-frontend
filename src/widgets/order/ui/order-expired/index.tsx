import { useTranslation } from "react-i18next";

import { Clock } from "lucide-react";

import { type ExpiredOrder, type PendingOrder } from "@entities/order";

import { getVenueRoute } from "@shared/constants";
import { useMainButton, useNavigateTo } from "@shared/hooks";

import { OrderResult } from "../order-result";

interface Props {
  // pending too: polling gave up before the backend cron flipped it.
  order: ExpiredOrder | PendingOrder;
  merchantName: string | undefined;
}

export const OrderExpired = ({ order, merchantName }: Props) => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  // A fresh order needs a fresh payment link — back to the merchant to buy
  // again (the merchant page accepts the numeric id as its handle).
  useMainButton({
    text: t("orders.expired.retry"),
    onClick: () => navigateTo(getVenueRoute(order.merchantId), { replace: true })
  });

  return (
    <OrderResult
      icon={<Clock size={32} strokeWidth={1.5} />}
      tone="neutral"
      title={t("orders.expired.title")}
      description={t("orders.expired.hint")}
      merchantName={merchantName}
      amount={order.amount}
    />
  );
};

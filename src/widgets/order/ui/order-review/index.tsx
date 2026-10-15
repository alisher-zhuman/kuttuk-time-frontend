import { useTranslation } from "react-i18next";

import { openTelegramLink } from "@tma.js/sdk-react";
import { Hourglass } from "lucide-react";

import { type Order } from "@entities/order";

import { SUPPORT_URL } from "@shared/constants";
import { useHaptic } from "@shared/hooks";

import { OrderResult } from "../order-result";

interface Props {
  order: Extract<Order, { status: "needs_review" }>;
  merchantName: string | undefined;
}

// Money was taken but the amount didn't match — resolved by hand on the
// backend. No technical details for the user, just reassurance and support.
export const OrderReview = ({ order, merchantName }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  return (
    <OrderResult
      icon={<Hourglass size={32} strokeWidth={1.5} />}
      tone="warning"
      title={t("orders.review.title")}
      description={t("orders.review.hint")}
      merchantName={merchantName}
      amount={order.amount}
    >
      {openTelegramLink.isAvailable() && (
        <button
          type="button"
          onClick={() => {
            haptic.light();
            openTelegramLink(SUPPORT_URL);
          }}
          className="px-5 py-2.5 rounded-full border border-(--color-line) bg-(--color-card) text-(--color-ink) text-sm font-semibold cursor-pointer"
        >
          {t("support.contact")}
        </button>
      )}
    </OrderResult>
  );
};

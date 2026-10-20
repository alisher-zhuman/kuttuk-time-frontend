import { useTranslation } from "react-i18next";

import { openTelegramLink } from "@tma.js/sdk-react";
import { Undo2 } from "lucide-react";

import { type Order } from "@entities/order";

import { SUPPORT_URL } from "@shared/constants";
import { useHaptic } from "@shared/hooks";

import { OrderResult } from "../order-result";

interface Props {
  order: Extract<Order, { status: "refunded" }>;
  merchantName: string | undefined;
}

// A needs_review order resolved by returning the money by hand. Nothing to act
// on in the app — just say so and point to support in case it hasn't arrived.
export const OrderRefunded = ({ order, merchantName }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  return (
    <OrderResult
      icon={<Undo2 size={32} strokeWidth={1.5} />}
      tone="neutral"
      title={t("orders.refunded.title")}
      description={t("orders.refunded.hint")}
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

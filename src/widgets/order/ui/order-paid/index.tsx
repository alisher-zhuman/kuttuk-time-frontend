import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { shareURL } from "@tma.js/sdk-react";
import { Check, Copy, Gift } from "lucide-react";

import { type Order } from "@entities/order";

import { BOT_URL } from "@shared/constants";
import { formatDate, formatMoney } from "@shared/helpers";
import { useCopyToClipboard, useHaptic, useMainButton } from "@shared/hooks";

import { OrderResult } from "../order-result";

interface Props {
  order: Extract<Order, { status: "paid" }>;
  merchantName: string | undefined;
}

export const OrderPaid = ({ order, merchantName }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  const copyToClipboard = useCopyToClipboard();

  const [copied, setCopied] = useState(false);

  const { code, validUntil } = order.certificate;

  // Mounts when polling sees "paid" — the moment the payment lands.
  useEffect(() => {
    haptic.success();
  }, [haptic]);

  const handleCopy = async () => {
    haptic.light();

    if (await copyToClipboard(code)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  // shareURL closes the Mini App after the chat is picked — fine here, it's
  // the end of the flow, and the code is on screen to copy before that.
  useMainButton({
    text: t("orders.paid.share"),
    onClick: () => {
      haptic.light();

      if (shareURL.isAvailable()) {
        shareURL(
          BOT_URL,
          t("orders.paid.shareText", {
            merchant: merchantName ?? "",
            amount: formatMoney(order.amount, t("certificate.currency")),
            code
          })
        );
      }
    },
    hidden: !shareURL.isAvailable()
  });

  return (
    <OrderResult
      icon={<Gift size={32} strokeWidth={1.5} />}
      tone="success"
      title={t("orders.paid.title")}
      merchantName={merchantName}
      amount={order.amount}
    >
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs font-bold text-(--color-hint) uppercase tracking-wider">
          {t("orders.paid.code")}
        </span>

        <button
          type="button"
          onClick={() => void handleCopy()}
          aria-label={t("orders.paid.copy")}
          className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-(--color-chip) cursor-pointer"
        >
          <span className="font-mono text-xl font-bold tracking-wider text-(--color-ink)">
            {code}
          </span>

          {copied ? (
            <Check size={18} className="text-(--color-green)" />
          ) : (
            <Copy size={18} className="text-(--color-hint)" />
          )}
        </button>

        <span className="text-xs font-semibold text-(--color-hint)">
          {copied
            ? t("orders.paid.copied")
            : t("orders.paid.validUntil", { date: formatDate(validUntil) })}
        </span>
      </div>
    </OrderResult>
  );
};

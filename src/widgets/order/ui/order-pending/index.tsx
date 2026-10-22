import { useTranslation } from "react-i18next";

import { Loader2 } from "lucide-react";

import { type ExpiredOrder, type PendingOrder } from "@entities/order";

import { formatMoney, openExternalLink } from "@shared/helpers";
import { useMainButton } from "@shared/hooks";

import { useCountdown } from "../../hooks/useCountdown";

interface Props {
  // expired too: shown as "checking" during the late-webhook grace window.
  order: PendingOrder | ExpiredOrder;
  venueName: string | undefined;
}

const formatTimeLeft = (ms: number) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${minutes}:${seconds}`;
};

export const OrderPending = ({ order, venueName }: Props) => {
  const { t } = useTranslation();

  const msLeft = useCountdown(order.expiresAt);

  const isExpired = msLeft === 0;

  // The primary way to reach the payment page, not a fallback: openLink right
  // after the create-order request may be ignored by Telegram (no longer
  // inside the user's tap), and the user may also have closed the bank page.
  useMainButton({
    text: t("orders.pending.openPayment"),
    onClick: () => {
      if (order.status === "pending") {
        openExternalLink(order.paymentUrl);
      }
    },
    hidden: isExpired || order.status !== "pending"
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-5 py-8 text-center">
      <Loader2 size={40} className="animate-spin text-(--color-primary)" />

      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-extrabold tracking-tight text-(--color-ink)">
          {t("orders.pending.title")}
        </h1>

        <p className="text-sm text-(--color-slate) max-w-xs">
          {t(isExpired ? "orders.pending.checking" : "orders.pending.hint")}
        </p>
      </div>

      <div className="flex flex-col gap-1 px-5 py-4 rounded-2xl bg-(--color-card) border border-(--color-line) min-w-56">
        {venueName && (
          <span className="text-sm font-semibold text-(--color-slate)">{venueName}</span>
        )}

        <span className="text-2xl font-extrabold text-(--color-ink)">
          {formatMoney(order.amount, t("certificate.currency"))}
        </span>
      </div>

      {!isExpired && (
        <span className="text-sm font-semibold text-(--color-hint) tabular-nums">
          {t("orders.pending.timeLeft", { time: formatTimeLeft(msLeft) })}
        </span>
      )}
    </div>
  );
};

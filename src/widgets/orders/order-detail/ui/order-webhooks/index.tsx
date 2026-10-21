import { useTranslation } from "react-i18next";

import { type AdminOrderDetail } from "@entities/order";

import { cn, formatDateTime, formatMoney } from "@shared/helpers";

interface Props {
  webhooks: AdminOrderDetail["webhooks"];
  orderAmount: number;
}

// What Finik actually sent. For needs_review the point is the amount: Finik's
// next to the order's, a mismatch highlighted (result says amount_mismatch).
export const OrderWebhooks = ({ webhooks, orderAmount }: Props) => {
  const { t } = useTranslation();

  const currency = t("certificate.currency");

  return (
    <section className="flex flex-col gap-2.5">
      <h2 className="text-xs font-bold text-(--color-hint) tracking-wider px-1">
        {t("admin.orders.detail.webhooks")}
      </h2>

      {webhooks.length === 0 ? (
        <p className="text-sm font-semibold text-(--color-hint) px-1">
          {t("admin.orders.detail.noWebhooks")}
        </p>
      ) : (
        <ul className="flex flex-col gap-2 list-none">
          {webhooks.map((webhook, index) => {
            const isMismatch = webhook.amount !== null && webhook.amount !== orderAmount;

            return (
              <li
                key={`${webhook.receivedAt}-${index}`}
                className={cn(
                  "flex flex-col gap-1 p-3 rounded-2xl border",
                  isMismatch
                    ? "bg-(--color-accent-tint) border-transparent"
                    : "bg-(--color-card) border-(--color-line)"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-(--color-hint)">
                    {formatDateTime(webhook.receivedAt)}
                  </span>
                  {webhook.result && (
                    <span className="font-mono text-xs font-bold text-(--color-slate) break-all text-right">
                      {webhook.result}
                    </span>
                  )}
                </div>

                <span className="text-sm font-bold text-(--color-ink)">
                  {webhook.amount === null
                    ? t("admin.orders.detail.noAmount")
                    : t("admin.orders.detail.webhookAmount", {
                        amount: formatMoney(webhook.amount, currency)
                      })}
                </span>

                {isMismatch && (
                  <span className="text-xs font-bold text-(--color-accent)">
                    {t("admin.orders.detail.amountMismatch", {
                      amount: formatMoney(orderAmount, currency)
                    })}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

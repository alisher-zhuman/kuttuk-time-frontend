import { useTranslation } from "react-i18next";

import { ChevronRight } from "lucide-react";

import { type AdminOrderDetail, OrderStatusBadge } from "@entities/order";

import { formatDate, formatDateTime, formatMoney } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";
import { MetaField } from "@shared/ui";

import { OrderResolutions } from "../order-resolutions";
import { OrderWebhooks } from "../order-webhooks";

interface Props {
  order: AdminOrderDetail;
  onOpenVenue: () => void;
  onOpenMerchant: () => void;
}

export const OrderDetail = ({ order, onOpenVenue, onOpenMerchant }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  const link = (label: string, onOpen: () => void) => (
    <button
      type="button"
      onClick={() => {
        haptic.light();
        onOpen();
      }}
      className="inline-flex items-center gap-1 text-(--color-primary) cursor-pointer text-left"
    >
      {label}
      <ChevronRight size={14} className="shrink-0" />
    </button>
  );

  const paidAt = "paidAt" in order ? order.paidAt : undefined;

  return (
    <div className="flex flex-col py-4 gap-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-2xl font-extrabold text-(--color-ink)">
          {formatMoney(order.amount, t("certificate.currency"))}
        </span>
        <div className="flex items-center gap-2">
          {order.status === "paid" && order.payoutId && (
            <span className="text-xs font-bold text-(--color-green)">{t("admin.orders.paidOut")}</span>
          )}
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-4">
        <MetaField label={t("admin.orders.detail.venue")} value={link(order.venue.name, onOpenVenue)} />
        <MetaField
          label={t("admin.orders.detail.merchant")}
          value={link(order.merchant.name, onOpenMerchant)}
        />
        <MetaField label={t("admin.orders.detail.createdAt")} value={formatDateTime(order.createdAt)} />
        {paidAt ? (
          <MetaField label={t("admin.orders.detail.paidAt")} value={formatDateTime(paidAt)} />
        ) : (
          <MetaField label={t("admin.orders.detail.expiresAt")} value={formatDateTime(order.expiresAt)} />
        )}
        <MetaField
          label={t("admin.orders.detail.buyer")}
          value={<span className="font-mono">{order.buyer.telegramId}</span>}
        />
        {order.finikTransactionId && (
          <MetaField
            label={t("admin.orders.detail.transaction")}
            value={<span className="font-mono text-xs break-all">{order.finikTransactionId}</span>}
          />
        )}
        <div className="col-span-2">
          <MetaField
            label={t("admin.orders.detail.id")}
            value={<span className="font-mono text-xs break-all">{order.id}</span>}
          />
        </div>
      </div>

      {order.certificate && (
        <section className="flex flex-col gap-2.5">
          <h2 className="text-xs font-bold text-(--color-hint) tracking-wider px-1">
            {t("admin.orders.detail.certificate")}
          </h2>
          <div className="flex flex-col gap-1 p-3 rounded-2xl bg-(--color-card) border border-(--color-line)">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm font-bold tracking-wider text-(--color-ink)">
                {order.certificate.code}
              </span>
              <span className="text-xs font-bold text-(--color-slate)">
                {t(`certificate.status.${order.certificate.status}`)}
              </span>
            </div>
            <span className="text-xs text-(--color-slate)">
              {order.certificate.status === "used"
                ? t("admin.orders.detail.usedAt", { date: formatDateTime(order.certificate.usedAt) })
                : t("admin.orders.detail.validUntil", { date: formatDate(order.certificate.validUntil) })}
            </span>
          </div>
        </section>
      )}

      <OrderWebhooks webhooks={order.webhooks} orderAmount={order.amount} />

      {order.resolutions.length > 0 && <OrderResolutions resolutions={order.resolutions} />}
    </div>
  );
};

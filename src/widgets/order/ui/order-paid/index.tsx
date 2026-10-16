import { useEffect } from "react";

import { useTranslation } from "react-i18next";

import { Gift } from "lucide-react";

import { CertificateCode, useCertificateShareButton } from "@entities/certificate";
import { type Order } from "@entities/order";

import { formatDate } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";

import { OrderResult } from "../order-result";

interface Props {
  order: Extract<Order, { status: "paid" }>;
  merchantName: string | undefined;
}

export const OrderPaid = ({ order, merchantName }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  const { code, validUntil } = order.certificate;

  // Mounts when polling sees "paid" — the moment the payment lands.
  useEffect(() => {
    haptic.success();
  }, [haptic]);

  useCertificateShareButton({ code, amount: order.amount, merchantName });

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
          {t("certificate.code")}
        </span>

        <CertificateCode
          code={code}
          size="lg"
          caption={t("certificate.validUntil", { date: formatDate(validUntil) })}
        />
      </div>
    </OrderResult>
  );
};

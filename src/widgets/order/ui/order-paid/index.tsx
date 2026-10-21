import { useEffect } from "react";

import { useTranslation } from "react-i18next";

import { Gift } from "lucide-react";

import {
  CertificateCode,
  useCertificateShareButton,
  useMyCertificatesQuery
} from "@entities/certificate";
import { type Order } from "@entities/order";

import { formatDate } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";

import { OrderResult } from "../order-result";

interface Props {
  order: Extract<Order, { status: "paid" }>;
  venueName: string | undefined;
}

export const OrderPaid = ({ order, venueName }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  const { code, validUntil } = order.certificate;

  // Mounts when polling sees "paid" — the moment the payment lands.
  useEffect(() => {
    haptic.success();
  }, [haptic]);

  // The order only carries the code; "Подарить" needs the certificate's id —
  // take it from "My certificates" (refreshed when the order turned paid).
  const { certificates, isLoading } = useMyCertificatesQuery();
  const certificate = certificates.find((item) => item.code === code);

  useCertificateShareButton({
    id: certificate?.id,
    code,
    amount: order.amount,
    venueName,
    // Wait for the list, so the label doesn't flip from "Share" to "Gift";
    // a certificate already used / expired isn't offered.
    hidden: isLoading || (certificate !== undefined && certificate.status !== "active")
  });

  return (
    <OrderResult
      icon={<Gift size={32} strokeWidth={1.5} />}
      tone="success"
      title={t("orders.paid.title")}
      venueName={venueName}
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

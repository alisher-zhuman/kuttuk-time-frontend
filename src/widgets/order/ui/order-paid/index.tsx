import { useEffect } from "react";

import { useTranslation } from "react-i18next";

import { Gift } from "lucide-react";

import {
  CertificateCodeBlock,
  useCertificateShareButton
} from "@entities/certificate";
import { type Order } from "@entities/order";

import { useHaptic } from "@shared/hooks";

import { OrderResult } from "../order-result";

interface Props {
  order: Extract<Order, { status: "paid" }>;
  venueName: string | undefined;
}

export const OrderPaid = ({ order, venueName }: Props) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  const { id, code, status } = order.certificate;

  // An order reopened later may hold a certificate already used or expired —
  // then no QR and no «Подарить», like on the certificate screen.
  const isActive = status === "active";

  // Mounts when polling sees "paid" — the moment the payment lands.
  useEffect(() => {
    haptic.success();
  }, [haptic]);

  useCertificateShareButton({ id, code, amount: order.amount, venueName, hidden: !isActive });

  return (
    <OrderResult
      icon={<Gift size={32} strokeWidth={1.5} />}
      tone="success"
      title={t("orders.paid.title")}
      venueName={venueName}
      amount={order.amount}
    >
      <CertificateCodeBlock certificate={order.certificate} />
    </OrderResult>
  );
};

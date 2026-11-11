import { useEffect } from "react";

import { useTranslation } from "react-i18next";

import { Gift } from "lucide-react";

import { TelegramLoginPrompt } from "@features/telegram-login";

import {
  CertificateCodeBlock,
  CertificateGiftHint,
  isUsable,
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

  const { id, code } = order.certificate;

  // Mounts when polling sees "paid" - the moment the payment lands.
  useEffect(() => {
    haptic.success();
  }, [haptic]);

  // An order reopened later (from the bot's old messages) may hold a
  // certificate already used, expired or given away - then no QR and no
  // «Подарить», like on the certificate screen.
  const { canGift } = useCertificateShareButton({
    id,
    code,
    amount: order.amount,
    venueName,
    hidden: !isUsable(order.certificate)
  });

  return (
    <OrderResult
      icon={<Gift size={32} strokeWidth={1.5} />}
      tone="success"
      title={t("orders.paid.title")}
      venueName={venueName}
      amount={order.amount}
    >
      <CertificateCodeBlock certificate={order.certificate} />

      {canGift && <CertificateGiftHint />}

      <TelegramLoginPrompt />
    </OrderResult>
  );
};

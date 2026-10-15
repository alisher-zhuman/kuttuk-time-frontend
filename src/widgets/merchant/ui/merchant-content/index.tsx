import { useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { type MerchantDetail } from "@entities/merchant";
import { getOrderErrorKey, useCreateOrderMutation } from "@entities/order";

import { getOrderRoute } from "@shared/constants";
import { openExternalLink } from "@shared/helpers";
import { useHaptic, useMainButton, useNavigateTo, usePopup } from "@shared/hooks";

import { CertPreviewCard } from "../cert-preview-card";
import { MerchantHeader } from "../merchant-header";
import { NominalList } from "../nominal-list";

interface Props {
  merchant: MerchantDetail;
}

export const MerchantContent = ({ merchant }: Props) => {
  const [selectedNominal, setSelectedNominal] = useState<number | null>(null);

  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const showPopup = usePopup();

  // The pending flag only lands on the next render, so two taps in the same
  // frame would both see it false and create two orders — guard with a ref.
  const isSubmittingRef = useRef(false);

  const { mutate: createOrder, isPending } = useCreateOrderMutation();

  // nominals can change under the selection (refetch after a language switch,
  // the merchant editing them) — never buy an amount that's no longer offered.
  const activeNominal =
    selectedNominal !== null && merchant.nominals.includes(selectedNominal)
      ? selectedNominal
      : merchant.nominals[0]!;

  const handleBuy = () => {
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    haptic.medium();

    createOrder(
      { merchantId: merchant.id, nominal: activeNominal },
      {
        onSuccess: ({ orderId, paymentUrl }) => {
          openExternalLink(paymentUrl);
          // Push, not replace: Back from the order screen returns here.
          navigateTo(getOrderRoute(orderId));
        },
        onError: (error) => {
          haptic.error();

          void showPopup({
            title: t("errors.genericTitle"),
            message: t(getOrderErrorKey(error))
          });
        },
        onSettled: () => {
          isSubmittingRef.current = false;
        }
      }
    );
  };

  useMainButton({
    text: t("merchantDetail.buy"),
    onClick: handleBuy,
    disabled: isPending,
    loading: isPending
  });

  return (
    <div className="flex-1 flex flex-col py-4 gap-5">
      <MerchantHeader
        logo={merchant.logo}
        name={merchant.name}
        description={merchant.description}
      />

      <CertPreviewCard
        merchantName={merchant.name}
        amount={activeNominal}
        validityMonths={merchant.validityMonths}
      />

      <NominalList
        nominals={merchant.nominals}
        selected={activeNominal}
        onSelect={setSelectedNominal}
      />
    </div>
  );
};

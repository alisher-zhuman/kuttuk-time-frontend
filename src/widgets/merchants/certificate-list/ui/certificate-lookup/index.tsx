import { useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import {
  getRedemptionErrorKey,
  isRedeemConflict,
  type MerchantCertificate,
  useMerchantCertificateQuery,
  useRedeemCertificateMutation
} from "@entities/certificate";

import { formatMoney } from "@shared/helpers";
import { useHaptic, usePopup } from "@shared/hooks";

import { CertificateCard } from "../certificate-card";

interface Props {
  code: string;
  // A list row — shown until the fresh lookup lands.
  fallback?: MerchantCertificate;
}

// One certificate by its code: looked up fresh (the status changes at the
// counter), with "Redeem" while active. Used by the code field and the sheet.
export const CertificateLookup = ({ code, fallback }: Props) => {
  const [justRedeemed, setJustRedeemed] = useState(false);

  const { t } = useTranslation();

  const haptic = useHaptic();

  const showPopup = usePopup();

  // isPending lands a render late — two taps in one frame would both POST, and
  // the second 409 would read as an error.
  const isRedeemingRef = useRef(false);

  const { certificate = fallback, error, isError, refetch } = useMerchantCertificateQuery(code);

  // On success it puts the "used" certificate into this lookup's cache.
  const { mutate: redeem, isPending } = useRedeemCertificateMutation();

  const handleRedeem = async (active: MerchantCertificate) => {
    if (isRedeemingRef.current) return;

    isRedeemingRef.current = true;

    // No undo — always confirm.
    const buttonId = await showPopup({
      title: t("merchant.redeem.confirmTitle"),
      message: t("merchant.redeem.confirmMessage", {
        amount: formatMoney(active.amount, t("certificate.currency")),
        venue: active.venue.name,
        code: active.code
      }),
      buttons: [
        { id: "cancel", type: "cancel" },
        { id: "redeem", type: "default", text: t("merchant.redeem.submit") }
      ]
    });

    if (buttonId !== "redeem") {
      isRedeemingRef.current = false;
      return;
    }

    redeem(
      { code },
      {
        onSuccess: () => {
          haptic.success();
          setJustRedeemed(true);
        },
        onError: (redeemError) => {
          // Used / expired a moment ago: re-fetch so the card shows why.
          if (isRedeemConflict(redeemError)) {
            haptic.warning();
            void refetch();
            return;
          }

          haptic.error();

          void showPopup({
            title: t("errors.genericTitle"),
            message: t(getRedemptionErrorKey(redeemError))
          });
        },
        onSettled: () => {
          isRedeemingRef.current = false;
        }
      }
    );
  };

  if (isError && !certificate) {
    return (
      <span className="text-sm font-semibold text-(--color-accent) px-1">
        {t(getRedemptionErrorKey(error))}
      </span>
    );
  }

  if (!certificate) {
    return <div className="h-40 rounded-2xl bg-(--color-chip) animate-pulse" />;
  }

  return (
    <CertificateCard
      certificate={certificate}
      onRedeem={() => void handleRedeem(certificate)}
      isRedeeming={isPending}
      justRedeemed={justRedeemed}
    />
  );
};

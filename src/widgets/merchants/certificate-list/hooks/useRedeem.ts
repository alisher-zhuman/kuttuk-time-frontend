import { useRef } from "react";

import { useTranslation } from "react-i18next";

import {
  getRedemptionErrorKey,
  isRedeemConflict,
  type MerchantCertificate,
  useRedeemCertificateMutation
} from "@entities/certificate";

import { formatMoney } from "@shared/helpers";
import { useHaptic, usePopup } from "@shared/hooks";

interface Options {
  // Called with the backend's "used" certificate.
  onRedeemed: (certificate: Extract<MerchantCertificate, { status: "used" }>) => void;
  // 409: used / expired a moment ago — re-fetch so the card shows why.
  onConflict: () => void;
}

// Confirm (native popup — there's no undo) → POST …/redeem. Shared by the code
// field and the certificate sheet.
export const useRedeem = ({ onRedeemed, onConflict }: Options) => {
  const { t } = useTranslation();

  const haptic = useHaptic();

  const showPopup = usePopup();

  // isPending lands a render late — two taps in one frame would both POST, and
  // the second 409 would read as an error.
  const isRedeemingRef = useRef(false);

  const { mutate, isPending } = useRedeemCertificateMutation();

  const redeem = async (certificate: MerchantCertificate) => {
    if (isRedeemingRef.current || certificate.status !== "active") return;

    isRedeemingRef.current = true;

    const buttonId = await showPopup({
      title: t("merchant.redeem.confirmTitle"),
      message: t("merchant.redeem.confirmMessage", {
        amount: formatMoney(certificate.amount, t("certificate.currency")),
        venue: certificate.venue.name,
        code: certificate.code
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

    mutate(
      { code: certificate.code },
      {
        onSuccess: (result) => {
          if (result.status === "used") {
            haptic.success();
            onRedeemed(result);
          }
        },
        onError: (error) => {
          if (isRedeemConflict(error)) {
            haptic.warning();
            onConflict();
            return;
          }

          haptic.error();

          void showPopup({
            title: t("errors.genericTitle"),
            message: t(getRedemptionErrorKey(error))
          });
        },
        onSettled: () => {
          isRedeemingRef.current = false;
        }
      }
    );
  };

  return { redeem: (certificate: MerchantCertificate) => void redeem(certificate), isRedeeming: isPending };
};

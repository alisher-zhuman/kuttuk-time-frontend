import { useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import {
  formatCertificateCode,
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
  // Instead of the in-place "redeemed" card — the code field clears itself
  // for the next customer and shows the result on its own.
  onRedeemed?: (certificate: Extract<MerchantCertificate, { status: "used" }>) => void;
}

// One certificate by its code: looked up fresh (the status changes at the
// counter), with "Redeem" while active. Used by the code field and the sheet.
// Telegram's popup message is capped at 256 characters and venue names have no
// limit yet — keep the name short enough for the whole message to fit.
const VENUE_NAME_MAX = 60;
const shorten = (value: string) =>
  value.length > VENUE_NAME_MAX ? `${value.slice(0, VENUE_NAME_MAX - 1).trimEnd()}…` : value;

export const CertificateLookup = ({ code, fallback, onRedeemed }: Props) => {
  const [justRedeemed, setJustRedeemed] = useState(false);
  const [isConfirmFailed, setIsConfirmFailed] = useState(false);

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
        venue: shorten(active.venue.name),
        code: formatCertificateCode(active.code)
      }),
      buttons: [
        { id: "cancel", type: "cancel" },
        { id: "redeem", type: "default", text: t("merchant.redeem.submit") }
      ]
    });

    // The confirmation didn't open — say so instead of a silent button.
    setIsConfirmFailed(buttonId === undefined);

    if (buttonId !== "redeem") {
      isRedeemingRef.current = false;
      return;
    }

    redeem(
      { code },
      {
        onSuccess: (result) => {
          haptic.success();

          if (onRedeemed && result.status === "used") {
            onRedeemed(result);
          } else {
            setJustRedeemed(true);
          }
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
    <>
      <CertificateCard
        certificate={certificate}
        onRedeem={() => void handleRedeem(certificate)}
        isRedeeming={isPending}
        justRedeemed={justRedeemed}
      />

      {isConfirmFailed && (
        <span className="text-sm font-semibold text-(--color-accent) px-1">
          {t("merchant.redeem.confirmFailed")}
        </span>
      )}
    </>
  );
};

import { useEffect, useEffectEvent, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import { isAxiosError } from "axios";

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
import { PillButton } from "@shared/ui";

import { CertificateCard } from "../certificate-card";

interface Props {
  code: string;
  // A list row - shown until the fresh lookup lands.
  fallback?: MerchantCertificate;
  // Instead of the in-place "redeemed" card - the code field clears itself
  // for the next customer and shows the result on its own.
  onRedeemed?: (certificate: Extract<MerchantCertificate, { status: "used" }>) => void;
  // Scanned from the customer's QR: ask «Погасить?» as soon as it's found
  // active - the scan already said "this one". Typed codes wait for the tap.
  confirmOnLoad?: boolean;
}

// One certificate by its code: looked up fresh (the status changes at the
// counter), with "Redeem" while active. Used by the code field and the sheet.
// Telegram's popup message is capped at 256 characters and venue names have no
// limit yet - keep the name short enough for the whole message to fit.
const VENUE_NAME_MAX = 60;
const shorten = (value: string) =>
  value.length > VENUE_NAME_MAX ? `${value.slice(0, VENUE_NAME_MAX - 1).trimEnd()}…` : value;

// Used this recently = most likely by this very tap, whose answer was lost on
// a bad connection - shown as the success it was, not as «Уже погашен».
const JUST_REDEEMED_MS = 2 * 60_000;

const isJustRedeemed = (certificate: MerchantCertificate | undefined) =>
  certificate?.status === "used" && Date.now() - Date.parse(certificate.usedAt) < JUST_REDEEMED_MS;

// No answer at all (network, timeout) - the redeem may or may not have landed.
const isLostAnswer = (error: unknown) => isAxiosError(error) && !error.response;

// 400 / 404 won't change on a retry; anything else (network, timeout, 5xx) may.
const isRetryable = (error: unknown) =>
  !isAxiosError(error) || !error.response || error.response.status >= 500 || error.response.status === 429;

export const CertificateLookup = ({ code, fallback, onRedeemed, confirmOnLoad = false }: Props) => {
  const [justRedeemed, setJustRedeemed] = useState(false);
  const [isConfirmFailed, setIsConfirmFailed] = useState(false);

  const { t } = useTranslation();

  const haptic = useHaptic();

  const showPopup = usePopup();

  // isPending lands a render late - two taps in one frame would both POST, and
  // the second 409 would read as an error.
  const isRedeemingRef = useRef(false);

  const { certificate = fallback, error, isError, isFetching, refetch } = useMerchantCertificateQuery(code);

  // Once per scan - Отмена in the confirmation leaves the card at the counter.
  const hasAutoConfirmedRef = useRef(false);

  // On success it puts the "used" certificate into this lookup's cache.
  const { mutate: redeem, isPending } = useRedeemCertificateMutation();

  const handleRedeem = async (active: MerchantCertificate) => {
    if (isRedeemingRef.current) return;

    isRedeemingRef.current = true;

    // No undo - always confirm.
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

    // The confirmation didn't open - say so instead of a silent button.
    setIsConfirmFailed(buttonId === undefined);

    if (buttonId !== "redeem") {
      isRedeemingRef.current = false;
      return;
    }

    const showRedeemed = (result: MerchantCertificate) => {
      haptic.success();

      if (onRedeemed && result.status === "used") {
        onRedeemed(result);
      } else {
        setJustRedeemed(true);
      }
    };

    const handleRedeemError = async (redeemError: unknown) => {
      // The answer was lost, or it's "already used" (a tap after a lost
      // answer): look the code up - redeemed just now is this tap's success.
      if (isLostAnswer(redeemError) || isRedeemConflict(redeemError)) {
        const { data: fresh } = await refetch();

        if (fresh && isJustRedeemed(fresh)) {
          showRedeemed(fresh);
          return;
        }

        // Used / expired a while ago: the card now shows why.
        if (isRedeemConflict(redeemError)) {
          haptic.warning();
          return;
        }
      }

      haptic.error();

      void showPopup({
        title: t("errors.genericTitle"),
        message: t(getRedemptionErrorKey(redeemError))
      });
    };

    redeem(
      { code },
      {
        onSuccess: (result) => {
          isRedeemingRef.current = false;
          showRedeemed(result);
        },
        // The guard holds until the look-up after an error is done - a tap
        // meanwhile would redeem again.
        onError: (redeemError) =>
          void handleRedeemError(redeemError).finally(() => {
            isRedeemingRef.current = false;
          })
      }
    );
  };

  const confirmScanned = useEffectEvent((active: MerchantCertificate) => void handleRedeem(active));

  // The fresh look-up, not a cached one: the status changes at the counter.
  useEffect(() => {
    if (!confirmOnLoad || hasAutoConfirmedRef.current || isFetching) return;
    if (certificate?.status !== "active") return;

    hasAutoConfirmedRef.current = true;
    confirmScanned(certificate);
  }, [confirmOnLoad, certificate, isFetching]);

  if (isError && !certificate) {
    return (
      <div className="flex flex-col items-start gap-2.5 px-1">
        <span className="text-sm font-semibold text-(--color-accent)">
          {t(getRedemptionErrorKey(error))}
        </span>

        {isRetryable(error) && (
          <PillButton
            disabled={isFetching}
            onClick={() => {
              haptic.light();
              void refetch();
            }}
            className="disabled:opacity-60"
          >
            {t("errors.retry")}
          </PillButton>
        )}
      </div>
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

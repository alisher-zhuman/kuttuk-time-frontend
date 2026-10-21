import { type FormEvent, useRef, useState } from "react";

import { useTranslation } from "react-i18next";

import {
  getRedemptionErrorKey,
  isRedeemConflict,
  type MerchantCertificate,
  useMerchantCertificateQuery,
  useRedeemCertificateMutation
} from "@entities/certificate";

import { useHaptic, useMainButton, usePopup } from "@shared/hooks";
import { Input } from "@shared/ui";

import { RedemptionCard } from "../redemption-card";
import { RedemptionSuccess } from "../redemption-success";

// Step 1: type the code and check it (GET). Step 2: the card, and for an
// active certificate the MainButton "Redeem" (POST). The QR scanner, when it
// comes, will just fill the same code field.
interface Props {
  // From a row of the certificate list: prefilled and checked right away.
  initialCode: string | null;
}

export const CertificateRedemption = ({ initialCode }: Props) => {
  const [code, setCode] = useState(initialCode ?? "");
  const [submittedCode, setSubmittedCode] = useState<string | null>(initialCode);
  const [redeemed, setRedeemed] = useState<Extract<
    MerchantCertificate,
    { status: "used" }
  > | null>(null);

  const { t } = useTranslation();

  const haptic = useHaptic();

  const showPopup = usePopup();

  // isPending lands a render late — two taps in one frame would both POST, and
  // the second 409 would read as an error.
  const isRedeemingRef = useRef(false);

  const { certificate, error, isLoading, isError, isFetching, refetch } =
    useMerchantCertificateQuery(submittedCode);

  const { mutate: redeem, isPending } = useRedeemCertificateMutation();

  const handleCodeChange = (value: string) => {
    setCode(value);

    // The card belongs to the checked code; once the field changes, hide it so
    // "Redeem" can never act on a code that's no longer on screen.
    if (submittedCode !== null) {
      setSubmittedCode(null);
    }
  };

  const handleCheck = (event: FormEvent) => {
    event.preventDefault();

    const trimmed = code.trim();

    if (!trimmed) {
      return;
    }

    haptic.light();

    if (trimmed === submittedCode) {
      void refetch();
    } else {
      setSubmittedCode(trimmed);
    }
  };

  const handleRedeem = () => {
    if (isRedeemingRef.current || submittedCode === null || certificate?.status !== "active") {
      return;
    }

    isRedeemingRef.current = true;

    redeem(
      { code: submittedCode },
      {
        onSuccess: (result) => {
          if (result.status === "used") {
            haptic.success();
            setRedeemed(result);
          }
        },
        onError: (redeemError) => {
          // Someone redeemed it a moment ago, or it just expired: re-fetch so
          // the card shows the real status (and usedAt).
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

  useMainButton({
    text: t("merchant.redeem.submit"),
    onClick: handleRedeem,
    hidden: redeemed !== null || certificate?.status !== "active",
    disabled: isPending || isFetching,
    loading: isPending
  });

  const handleNext = () => {
    setRedeemed(null);
    setSubmittedCode(null);
    setCode("");
  };

  if (redeemed) {
    return <RedemptionSuccess certificate={redeemed} onNext={handleNext} />;
  }

  return (
    <div className="flex flex-col gap-4 mt-3.5 pb-5">
      <h1 className="text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight">
        {t("merchant.redeem.title")}
      </h1>

      <form onSubmit={handleCheck} className="flex flex-col gap-3">
        <Input
          label={t("certificate.code")}
          placeholder="KT-XXXX-XXXX"
          value={code}
          onChange={(event) => handleCodeChange(event.target.value)}
          autoCapitalize="characters"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          error={isError ? t(getRedemptionErrorKey(error)) : undefined}
        />

        <button
          type="submit"
          disabled={!code.trim() || isLoading}
          className="px-6 py-3 rounded-full border border-(--color-line) bg-(--color-card) text-(--color-ink) font-semibold text-sm cursor-pointer disabled:opacity-50"
        >
          {t("merchant.redeem.check")}
        </button>
      </form>

      {isLoading && <div className="h-36 rounded-2xl bg-(--color-chip) animate-pulse" />}

      {certificate && <RedemptionCard certificate={certificate} />}
    </div>
  );
};

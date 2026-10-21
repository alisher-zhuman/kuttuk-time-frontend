import { useState } from "react";

import { useTranslation } from "react-i18next";

import {
  getRedemptionErrorKey,
  type MerchantCertificate,
  useMerchantCertificateQuery
} from "@entities/certificate";

import { Input } from "@shared/ui";

import { useRedeem } from "../../hooks/useRedeem";
import { CertificateCard } from "../certificate-card";

// A full code once spaces / dashes and the optional "KT" are dropped: 8 letters
// or digits. Any case and Cyrillic look-alikes are fine — the backend
// normalizes; a wrong alphabet comes back as 400.
const isFullCode = (value: string) => {
  const body = value.replace(/[\s-]/g, "").replace(/^(KT|КТ)/i, "");

  return /^[0-9A-Za-zА-Яа-яЁё]{8}$/.test(body);
};

// The counter flow: type the code the customer shows → its card right below →
// "Redeem". The QR scanner, when it comes, goes at the right of this field
// and just fills it.
export const CodeLookup = () => {
  const [code, setCode] = useState("");
  const [redeemed, setRedeemed] = useState<Extract<MerchantCertificate, { status: "used" }> | null>(null);

  const { t } = useTranslation();

  const trimmed = code.trim();
  const lookupCode = isFullCode(trimmed) ? trimmed : null;

  const { certificate, error, isLoading, isError, refetch } = useMerchantCertificateQuery(lookupCode);

  const { redeem, isRedeeming } = useRedeem({
    onRedeemed: (result) => {
      setRedeemed(result);
      setCode("");
    },
    onConflict: () => void refetch()
  });

  const handleChange = (value: string) => {
    setCode(value);
    // A new code replaces the last success card.
    setRedeemed(null);
  };

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder={t("merchant.certificates.codePlaceholder")}
        value={code}
        onChange={(event) => handleChange(event.target.value)}
        autoCapitalize="characters"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        error={isError ? t(getRedemptionErrorKey(error)) : undefined}
      />

      {redeemed && <CertificateCard certificate={redeemed} justRedeemed />}

      {lookupCode && isLoading && <div className="h-40 rounded-2xl bg-(--color-chip) animate-pulse" />}

      {lookupCode && certificate && (
        <CertificateCard
          certificate={certificate}
          onRedeem={() => redeem(certificate)}
          isRedeeming={isRedeeming}
        />
      )}
    </div>
  );
};

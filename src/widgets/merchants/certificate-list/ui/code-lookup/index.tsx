import { useState } from "react";

import { useTranslation } from "react-i18next";

import { ScanLine } from "lucide-react";

import {
  CERTIFICATE_CODE_LENGTH,
  formatCertificateCode,
  type MerchantCertificate,
  toCertificateCodeDigits
} from "@entities/certificate";

import { useHaptic, useQrScanner } from "@shared/hooks";
import { Input } from "@shared/ui";

import { CertificateCard } from "../certificate-card";
import { CertificateLookup } from "../certificate-lookup";

// The counter flow: type the code the customer shows, or scan its QR → its
// card right below.
export const CodeLookup = () => {
  // Digits only; shown as "0471 8263". No maxLength on the input: the value
  // never grows past 8 digits, and a pasted "Код: 0471 8263" must not be cut
  // before its digits are picked out.
  const [digits, setDigits] = useState("");
  // The last redeemed certificate — shown after the field clears for the next
  // customer, until they start typing.
  const [redeemed, setRedeemed] = useState<MerchantCertificate | null>(null);

  const { t } = useTranslation();

  const haptic = useHaptic();

  const { isAvailable: canScan, scan } = useQrScanner();

  const isFull = digits.length === CERTIFICATE_CODE_LENGTH;

  const handleScan = async () => {
    haptic.light();

    // Only a certificate code closes the scanner: exactly 8 digits once
    // non-digits are dropped (a longer number is something else, not cut down).
    const text = await scan(
      (qr) => qr.replace(/\D/g, "").length === CERTIFICATE_CODE_LENGTH,
      t("merchant.certificates.scanHint")
    );

    // Closed without scanning.
    if (text === undefined) return;

    setRedeemed(null);
    setDigits(text.replace(/\D/g, ""));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Input
          placeholder={t("merchant.certificates.codePlaceholder")}
          value={formatCertificateCode(digits)}
          inputMode="numeric"
          autoComplete="off"
          className={canScan ? "pr-12" : undefined}
          onChange={(event) => {
            setDigits(toCertificateCodeDigits(event.target.value));
            setRedeemed(null);
          }}
        />

        {/* Hidden where Telegram has no scanner (desktop clients). */}
        {canScan && (
          <button
            type="button"
            aria-label={t("merchant.certificates.scan")}
            onClick={() => void handleScan()}
            className="absolute top-1 right-1 size-9 flex items-center justify-center rounded-lg text-(--color-primary) cursor-pointer"
          >
            <ScanLine size={20} />
          </button>
        )}
      </div>

      {redeemed && <CertificateCard certificate={redeemed} justRedeemed />}

      {isFull && (
        <CertificateLookup
          code={digits}
          onRedeemed={(result) => {
            setRedeemed(result);
            setDigits("");
          }}
        />
      )}
    </div>
  );
};

import { useState } from "react";

import { useTranslation } from "react-i18next";

import {
  CERTIFICATE_CODE_LENGTH,
  formatCertificateCode,
  type MerchantCertificate,
  toCertificateCodeDigits
} from "@entities/certificate";

import { Input } from "@shared/ui";

import { CertificateCard } from "../certificate-card";
import { CertificateLookup } from "../certificate-lookup";

// The counter flow: type the code the customer shows → its card right below.
// The QR scanner, when it comes, goes at the right of this field and fills it.
export const CodeLookup = () => {
  // Digits only; shown as "0471 8263". No maxLength on the input: the value
  // never grows past 8 digits, and a pasted "Код: 0471 8263" must not be cut
  // before its digits are picked out.
  const [digits, setDigits] = useState("");
  // The last redeemed certificate — shown after the field clears for the next
  // customer, until they start typing.
  const [redeemed, setRedeemed] = useState<MerchantCertificate | null>(null);

  const { t } = useTranslation();

  const isFull = digits.length === CERTIFICATE_CODE_LENGTH;

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder={t("merchant.certificates.codePlaceholder")}
        value={formatCertificateCode(digits)}
        inputMode="numeric"
        autoComplete="off"
        onChange={(event) => {
          setDigits(toCertificateCodeDigits(event.target.value));
          setRedeemed(null);
        }}
      />

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

import { useState } from "react";

import { useTranslation } from "react-i18next";

import { type MerchantCertificate } from "@entities/certificate";

import { Input } from "@shared/ui";

import { CertificateCard } from "../certificate-card";
import { CertificateLookup } from "../certificate-lookup";

// Codes are KT-XXXX-XXXX; spaces / dashes / "KT" are optional, so leave room.
const MAX_LENGTH = 20;

// Full once spaces, dashes and the optional "KT" are dropped and 8 symbols are
// left. The alphabet and Cyrillic look-alikes are the backend's job (400).
const isFullCode = (value: string) =>
  value.replace(/[\s-]/g, "").replace(/^(KT|КТ)/i, "").length === 8;

// The counter flow: type the code the customer shows → its card right below.
// The QR scanner, when it comes, goes at the right of this field and fills it.
export const CodeLookup = () => {
  const [code, setCode] = useState("");
  // The last redeemed certificate — shown after the field clears for the next
  // customer, until they start typing.
  const [redeemed, setRedeemed] = useState<MerchantCertificate | null>(null);

  const { t } = useTranslation();

  const lookupCode = isFullCode(code) ? code.trim() : null;

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder={t("merchant.certificates.codePlaceholder")}
        value={code}
        maxLength={MAX_LENGTH}
        onChange={(event) => {
          setCode(event.target.value);
          setRedeemed(null);
        }}
        autoCapitalize="characters"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
      />

      {redeemed && <CertificateCard certificate={redeemed} justRedeemed />}

      {lookupCode && (
        <CertificateLookup
          code={lookupCode}
          onRedeemed={(result) => {
            setRedeemed(result);
            setCode("");
          }}
        />
      )}
    </div>
  );
};

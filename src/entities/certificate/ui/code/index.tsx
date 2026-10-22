import { type MouseEvent, useState } from "react";

import { useTranslation } from "react-i18next";

import { Check, Copy } from "lucide-react";

import { cn } from "@shared/helpers";
import { useCopyToClipboard, useHaptic } from "@shared/hooks";

import { formatCertificateCode } from "../../model/code";

interface Props {
  code: string;
  // Shown under the code; swapped for "copied" for a moment after a copy.
  caption: string;
  size?: "md" | "lg";
}

export const CertificateCode = ({ code, caption, size = "md" }: Props) => {
  const [copied, setCopied] = useState(false);

  const { t } = useTranslation();

  const haptic = useHaptic();

  const copyToClipboard = useCopyToClipboard();

  const handleCopy = async (event: MouseEvent) => {
    // The code can sit inside a tappable card — copying shouldn't open it.
    event.stopPropagation();
    haptic.light();

    // Plain digits: they paste anywhere, and the cashier's field takes them as is.
    if (await copyToClipboard(code)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const isLarge = size === "lg";

  return (
    <div className={cn("flex flex-col gap-1.5", isLarge ? "items-center" : "items-start")}>
      <button
        type="button"
        onClick={(event) => void handleCopy(event)}
        // Contains the visible code, so voice control ("tap 0471 8263") finds it.
        aria-label={`${t("certificate.copy")} ${formatCertificateCode(code)}`}
        className={cn(
          "flex items-center gap-2 rounded-xl bg-(--color-chip) cursor-pointer",
          isLarge ? "px-5 py-3 rounded-2xl gap-2.5" : "px-2.5 py-1.5"
        )}
      >
        <span
          className={cn(
            "font-mono font-bold tracking-wider text-(--color-ink)",
            isLarge ? "text-xl" : "text-sm"
          )}
        >
          {formatCertificateCode(code)}
        </span>

        {copied ? (
          <Check size={isLarge ? 18 : 14} className="text-(--color-green)" />
        ) : (
          <Copy size={isLarge ? 18 : 14} className="text-(--color-hint)" />
        )}
      </button>

      <span className="text-xs font-semibold text-(--color-hint)">
        {copied ? t("certificate.copied") : caption}
      </span>
    </div>
  );
};

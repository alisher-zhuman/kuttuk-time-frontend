import { useState } from "react";

import { useTranslation } from "react-i18next";

import { Check, Copy } from "lucide-react";

import { useCopyToClipboard, useHaptic } from "@shared/hooks";

interface Props {
  orderId: string;
}

// needs_review is resolved on the server, not in the app (yet): the two
// commands, ready to copy into a terminal.
export const ResolveReviewHint = ({ orderId }: Props) => {
  const [copied, setCopied] = useState<string | null>(null);

  const { t } = useTranslation();

  const haptic = useHaptic();

  const copyToClipboard = useCopyToClipboard();

  const base = `npm run orders:resolve-review -- --order ${orderId}`;

  const commands = [
    { key: "issue", label: t("admin.orders.detail.resolveIssue"), text: `${base} --issue` },
    { key: "refunded", label: t("admin.orders.detail.resolveRefunded"), text: `${base} --refunded --note "…"` }
  ];

  const handleCopy = async (key: string, text: string) => {
    haptic.light();

    if (await copyToClipboard(text)) {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    }
  };

  return (
    <section className="flex flex-col gap-2 p-3 rounded-2xl bg-(--color-amber-tint)">
      <span className="text-sm font-semibold text-(--color-ink)">{t("admin.orders.detail.resolveHint")}</span>

      {commands.map(({ key, label, text }) => (
        <button
          key={key}
          type="button"
          onClick={() => void handleCopy(key, text)}
          aria-label={`${label}: ${t("admin.orders.detail.copyCommand")}`}
          className="flex items-start gap-2 p-2 rounded-xl bg-(--color-card) text-left cursor-pointer"
        >
          <span className="flex-1 min-w-0 flex flex-col gap-0.5">
            <span className="text-xs font-bold text-(--color-slate)">{label}</span>
            <span className="font-mono text-xs text-(--color-ink) break-all">{text}</span>
          </span>
          {copied === key ? (
            <Check size={16} className="text-(--color-green) shrink-0" />
          ) : (
            <Copy size={16} className="text-(--color-hint) shrink-0" />
          )}
        </button>
      ))}
    </section>
  );
};

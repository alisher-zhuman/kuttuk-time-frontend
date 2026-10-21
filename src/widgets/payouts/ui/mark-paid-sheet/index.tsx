import { useState } from "react";
import { createPortal } from "react-dom";

import { useTranslation } from "react-i18next";

import { cn, formatIsoDate, formatMoney } from "@shared/helpers";
import { useSafeArea } from "@shared/hooks";
import { Textarea } from "@shared/ui";

interface Props {
  merchantName: string;
  amount: number;
  from: string;
  to: string;
  isPending: boolean;
  onConfirm: (note: string) => void;
  onCancel: () => void;
}

const NOTE_MAX_LENGTH = 500;

// Confirmation before recording a payout — there's no undo. A sheet, not the
// native popup: the popup can't take the optional note. Portaled to <body>:
// <main>'s enter animation makes its own stacking context, so inside it even
// z-50 would sit under the bottom nav.
export const MarkPaidSheet = ({
  merchantName,
  amount,
  from,
  to,
  isPending,
  onConfirm,
  onCancel
}: Props) => {
  const [note, setNote] = useState("");

  const { t } = useTranslation();

  const insets = useSafeArea();

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end bg-black/40"
      onClick={() => !isPending && onCancel()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("admin.payouts.confirmTitle")}
        onClick={(event) => event.stopPropagation()}
        className="w-full flex flex-col gap-4 p-4 rounded-t-3xl bg-(--color-bg)"
        // Above the home indicator; the layout's padding doesn't reach a portal.
        style={{ paddingBottom: insets.bottom + 24 }}
      >
        <h2 className="text-lg font-extrabold text-(--color-ink)">
          {t("admin.payouts.confirmTitle")}
        </h2>

        <p className="text-sm text-(--color-ink)">
          {t("admin.payouts.confirmMessage", {
            amount: formatMoney(amount, t("certificate.currency")),
            merchant: merchantName,
            from: formatIsoDate(from),
            to: formatIsoDate(to)
          })}
        </p>

        <Textarea
          label={t("admin.payouts.note")}
          placeholder={t("admin.payouts.notePlaceholder")}
          value={note}
          maxLength={NOTE_MAX_LENGTH}
          onChange={(event) => setNote(event.target.value)}
        />

        <div className="flex gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl bg-(--color-chip) text-(--color-ink) text-sm font-bold cursor-pointer disabled:opacity-50"
          >
            {t("admin.payouts.cancel")}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => onConfirm(note.trim())}
            className={cn(
              "flex-1 py-3 rounded-2xl bg-(--color-primary) text-(--color-card) text-sm font-bold cursor-pointer",
              isPending && "opacity-60"
            )}
          >
            {t("admin.payouts.confirm")}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

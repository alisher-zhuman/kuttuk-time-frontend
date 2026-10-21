import { useState } from "react";

import { useTranslation } from "react-i18next";

import { cn, formatIsoDate, formatMoney } from "@shared/helpers";
import { BottomSheet, Textarea } from "@shared/ui";

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
// native popup: the popup can't take the optional note.
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

  return (
    <BottomSheet
      title={t("admin.payouts.confirmTitle")}
      onClose={onCancel}
      dismissible={!isPending}
    >
      {(close) => (
        <>
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
              onClick={close}
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
        </>
      )}
    </BottomSheet>
  );
};

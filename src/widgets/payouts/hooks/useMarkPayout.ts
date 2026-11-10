import { useState } from "react";

import { useTranslation } from "react-i18next";

import { isAmountChanged, isNothingToPayOut, useMarkPaidOutMutation } from "@entities/payout";

import { formatMoney } from "@shared/helpers";
import { useGenericError, useHaptic, usePopup } from "@shared/hooks";

// The week being confirmed: an id + week, not a snapshot of the amount - the
// open sheet reads the row from the latest data, so after a 409
// amount_changed it shows the new sum.
export interface MarkTarget {
  merchantId: number;
  week: string;
}

// Marking a merchant's week paid out - the same flow from the weekly report
// and from «Все долги». No undo: a mark on prod is a real payout record.
export const useMarkPayout = () => {
  const [target, setTarget] = useState<MarkTarget | null>(null);

  const { t } = useTranslation();

  const haptic = useHaptic();

  const showPopup = usePopup();

  const showGenericError = useGenericError();

  const { mutate: markPaid, isPending } = useMarkPaidOutMutation();

  const confirm = (row: { merchantName: string; due: number }, note: string) => {
    if (!target) return;

    const currency = t("certificate.currency");

    markPaid(
      { merchantId: target.merchantId, week: target.week, expectedPayout: row.due, ...(note && { note }) },
      {
        onSuccess: (payout) => {
          haptic.success();
          setTarget(null);
          // The server's amount and whether the bot reached the owner - the
          // mark is saved either way.
          void showPopup({
            title: t("admin.payouts.doneTitle"),
            message: t(payout.ownerNotified ? "admin.payouts.doneNotified" : "admin.payouts.doneNotNotified", {
              amount: formatMoney(payout.payout, currency),
              merchant: row.merchantName
            })
          });
        },
        onError: (error) => {
          // A sale landed while the confirmation was open: nothing recorded.
          // Keep it open - the data refetches and it shows the new amount to
          // check against what was transferred.
          if (isAmountChanged(error)) {
            haptic.warning();
            void showPopup({ message: t("admin.payouts.amountChanged") });
            return;
          }

          setTarget(null);

          // Already marked (double tap, another tab): the data refetches.
          if (isNothingToPayOut(error)) {
            haptic.warning();
            void showPopup({ message: t("admin.payouts.nothingToPay") });
            return;
          }

          haptic.error();
          showGenericError();
        }
      }
    );
  };

  return { target, open: setTarget, close: () => setTarget(null), confirm, isPending };
};

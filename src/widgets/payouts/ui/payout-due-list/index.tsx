import { useTranslation } from "react-i18next";

import { ChevronRight, Wallet } from "lucide-react";

import { usePayoutDueQuery } from "@entities/payout";

import { getAdminMerchantDetailRoute, getAdminPayoutsRoute } from "@shared/constants";
import { formatIsoDate, formatMoney } from "@shared/helpers";
import { useHaptic, useNavigateTo } from "@shared/hooks";
import { EmptyState, ErrorState } from "@shared/ui";

import { useMarkPayout } from "../../hooks/useMarkPayout";
import { MarkPaidSheet } from "../mark-paid-sheet";
import { PayoutDetails } from "../payout-details";

// «Все долги»: every merchant's unpaid weeks at once (oldest first) - for an
// admin who missed a Monday, or pays several weeks in one go.
export const PayoutDueList = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const marking = useMarkPayout();

  const { due, isLoading, isError, isFetching, retry } = usePayoutDueQuery();

  const currency = t("certificate.currency");

  if (isError) return <ErrorState onRetry={retry} isRetrying={isFetching} />;

  if (isLoading || !due) {
    return (
      <div className="flex flex-col gap-2.5">
        <div className="h-20 rounded-2xl bg-(--color-chip) animate-pulse" />
        <div className="h-40 rounded-2xl bg-(--color-chip) animate-pulse" />
      </div>
    );
  }

  if (due.merchants.length === 0) {
    return <EmptyState icon={<Wallet size={32} strokeWidth={1.5} />} message={t("admin.payouts.noDebts")} />;
  }

  // The open confirmation reads the week from the latest data (see MarkTarget).
  const markingMerchant = due.merchants.find((row) => row.merchantId === marking.target?.merchantId);
  const markingWeek = markingMerchant?.weeks.find((week) => week.from === marking.target?.week);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 p-4 rounded-2xl bg-(--color-card) border border-(--color-line)">
        <span className="text-xs font-bold text-(--color-hint) tracking-wider uppercase">
          {t("admin.payouts.dueTotal")}
        </span>
        <span className="text-2xl font-extrabold text-(--color-primary)">{formatMoney(due.total, currency)}</span>
      </div>

      <ul className="flex flex-col gap-2.5 list-none">
        {due.merchants.map((row) => (
          <li key={row.merchantId} className="flex flex-col gap-3 p-4 rounded-2xl bg-(--color-card) border border-(--color-line)">
            <button
              type="button"
              onClick={() => {
                haptic.light();
                navigateTo(getAdminMerchantDetailRoute(row.merchantId));
              }}
              className="flex items-start justify-between gap-3 text-left cursor-pointer"
            >
              <span className="min-w-0 text-base font-extrabold text-(--color-ink) line-clamp-2 wrap-break-word">
                {row.merchantName}
              </span>
              <span className="shrink-0 text-base font-extrabold text-(--color-primary)">
                {formatMoney(row.due, currency)}
              </span>
            </button>

            <PayoutDetails merchantId={row.merchantId} />

            <ul className="flex flex-col divide-y divide-(--color-line) list-none">
              {row.weeks.map((week) => (
                <li key={week.from} className="flex items-center gap-2 py-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      haptic.light();
                      navigateTo(getAdminPayoutsRoute({ week: week.from }));
                    }}
                    className="flex-1 min-w-0 flex items-center gap-1 text-left cursor-pointer"
                  >
                    <span className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-(--color-ink)">
                        {formatIsoDate(week.from)}-{formatIsoDate(week.to)}
                      </span>
                      <span className="text-xs text-(--color-slate)">
                        {t("admin.payouts.orders", { count: week.ordersCount })} · {formatMoney(week.due, currency)}
                      </span>
                    </span>
                    <ChevronRight size={14} className="shrink-0 text-(--color-hint)" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      haptic.light();
                      marking.open({ merchantId: row.merchantId, week: week.from });
                    }}
                    className="shrink-0 px-3 py-2 rounded-full bg-(--color-primary) text-(--color-card) text-xs font-bold cursor-pointer"
                  >
                    {t("admin.payouts.markShort")}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      {markingMerchant && markingWeek && (
        <MarkPaidSheet
          merchantId={markingMerchant.merchantId}
          merchantName={markingMerchant.merchantName}
          amount={markingWeek.due}
          from={markingWeek.from}
          to={markingWeek.to}
          isPending={marking.isPending}
          onConfirm={(note) =>
            marking.confirm({ merchantName: markingMerchant.merchantName, due: markingWeek.due }, note)
          }
          onCancel={marking.close}
        />
      )}
    </div>
  );
};

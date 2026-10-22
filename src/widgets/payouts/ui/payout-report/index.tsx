import { useState } from "react";

import { useTranslation } from "react-i18next";

import { TriangleAlert, Wallet } from "lucide-react";

import {
  isAmountChanged,
  isNothingToPayOut,
  useMarkPaidOutMutation,
  usePayoutWeekQuery
} from "@entities/payout";

import { getAdminMerchantDetailRoute, getAdminOrdersRoute } from "@shared/constants";
import { formatMoney } from "@shared/helpers";
import { useGenericError, useHaptic, useNavigateTo, usePopup, useWeekParam } from "@shared/hooks";
import { EmptyState, ErrorState, WeekSwitcher } from "@shared/ui";

import { MarkPaidSheet } from "../mark-paid-sheet";
import { PayoutRow } from "../payout-row";

// The weekly payout to merchants — the same report as the backend's
// `npm run report:payouts`. Week switching works like the owner's summary.
export const PayoutReport = () => {
  // The merchant whose payout is being confirmed — an id, not a row snapshot,
  // so the open confirmation shows the amount from the latest report.
  const [markingId, setMarkingId] = useState<number | null>(null);

  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const showPopup = usePopup();

  const showGenericError = useGenericError();

  const { mutate: markPaid, isPending: isMarking } = useMarkPaidOutMutation();

  // The current week as the backend sees it — see useWeekParam.
  const { report: current } = usePayoutWeekQuery(null);

  const { week, shift } = useWeekParam(current?.from);

  const { report, isLoading, isError, isFetching, retry } = usePayoutWeekQuery(week);

  const currency = t("certificate.currency");

  const marking = report?.merchants.find((row) => row.merchantId === markingId);

  const handleConfirm = (note: string) => {
    if (!report || !marking) return;

    const merchantName = marking.merchantName;

    markPaid(
      {
        merchantId: marking.merchantId,
        week: report.from,
        expectedPayout: marking.due,
        ...(note && { note })
      },
      {
        onSuccess: (payout) => {
          haptic.success();
          setMarkingId(null);
          // The server's amount — it may differ from the screen if an order
          // landed in the week meanwhile.
          void showPopup({
            title: t("admin.payouts.doneTitle"),
            message: t("admin.payouts.done", {
              amount: formatMoney(payout.payout, currency),
              merchant: merchantName
            })
          });
        },
        onError: (error) => {
          // A sale landed while the confirmation was open: nothing recorded.
          // Keep it open — the report refetches and it shows the new amount
          // to check against what was transferred.
          if (isAmountChanged(error)) {
            haptic.warning();
            void showPopup({ message: t("admin.payouts.amountChanged") });
            return;
          }

          setMarkingId(null);

          // Already marked (double tap, another tab): the week refetches.
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

  const isCurrentWeek = report !== undefined && report.from === current?.from;

  return (
    <div className="flex flex-col gap-4 mt-3.5 pb-5">
      <h1 className="text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight">
        {t("admin.payouts.title")}
      </h1>

      <WeekSwitcher range={report} isCurrent={isCurrentWeek} onShift={shift} />

      {isError ? (
        <ErrorState onRetry={retry} isRetrying={isFetching} />
      ) : isLoading || !report ? (
        <div className="flex flex-col gap-2.5">
          <div className="h-32 rounded-2xl bg-(--color-chip) animate-pulse" />
          <div className="h-20 rounded-2xl bg-(--color-chip) animate-pulse" />
        </div>
      ) : (
        <>
          {report.needsReviewCount > 0 && (
            <button
              type="button"
              onClick={() => {
                haptic.light();
                navigateTo(getAdminOrdersRoute("needs_review"), { replace: true });
              }}
              className="flex items-start gap-3 p-3 rounded-2xl bg-(--color-amber-tint) text-left cursor-pointer"
            >
              <TriangleAlert size={20} className="text-(--color-amber) shrink-0" />
              <span className="flex-1 flex flex-col gap-1">
                <span className="text-sm font-semibold text-(--color-ink)">
                  {t("admin.payouts.needsReview", { count: report.needsReviewCount })}
                </span>
                <span className="text-sm font-bold text-(--color-amber)">
                  {t("admin.payouts.openOrders")}
                </span>
              </span>
            </button>
          )}

          <div className="flex flex-col gap-3 p-4 rounded-2xl bg-(--color-card) border border-(--color-line)">
            <span className="text-xs font-bold text-(--color-hint) tracking-wider uppercase">
              {t("admin.payouts.total")}
            </span>
            <span className="text-sm font-semibold text-(--color-ink)">
              {t("admin.payouts.orders", { count: report.total.ordersCount })} ·{" "}
              {t("admin.payouts.gross", { amount: formatMoney(report.total.gross, currency) })}
            </span>
            <span className="text-sm font-semibold text-(--color-ink)">
              {t("admin.payouts.commission", { amount: formatMoney(report.total.commission, currency) })}
            </span>
            <span className="text-base font-extrabold text-(--color-primary)">
              {t("admin.payouts.payout", { amount: formatMoney(report.total.payout, currency) })}
            </span>
            {(report.total.paidOut > 0 || report.total.due > 0) && (
              <span className="text-sm font-semibold text-(--color-slate)">
                {t("admin.payouts.totalPaidOut", {
                  amount: formatMoney(report.total.paidOut, currency)
                })}
                {" · "}
                {t("admin.payouts.totalDue", { amount: formatMoney(report.total.due, currency) })}
              </span>
            )}
          </div>

          {report.merchants.length === 0 ? (
            <EmptyState
              icon={<Wallet size={32} strokeWidth={1.5} />}
              message={t("admin.payouts.empty")}
            />
          ) : (
            <section aria-label={t("admin.payouts.merchants")} className="flex flex-col gap-2.5">
              <h2 className="text-xs font-bold text-(--color-hint) tracking-wider px-1">
                {t("admin.payouts.merchants")}
              </h2>

              <ul className="flex flex-col gap-2.5 list-none">
                {report.merchants.map((row) => (
                  <li key={row.merchantId}>
                    <PayoutRow
                      row={row}
                      onOpen={() => {
                        haptic.light();
                        navigateTo(getAdminMerchantDetailRoute(row.merchantId));
                      }}
                      onMarkPaid={() => setMarkingId(row.merchantId)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      {/* Closes by itself if the refetched row has nothing left to pay. */}
      {report && marking && marking.due > 0 && (
        <MarkPaidSheet
          merchantName={marking.merchantName}
          amount={marking.due}
          from={report.from}
          to={report.to}
          isPending={isMarking}
          onConfirm={handleConfirm}
          onCancel={() => setMarkingId(null)}
        />
      )}
    </div>
  );
};

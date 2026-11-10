import { useTranslation } from "react-i18next";

import { TriangleAlert, Wallet } from "lucide-react";

import { usePayoutWeekQuery } from "@entities/payout";

import { getAdminMerchantDetailRoute, getAdminOrdersRoute } from "@shared/constants";
import { formatMoney, shiftIsoDate } from "@shared/helpers";
import { useHaptic, useNavigateTo, useSearchParamState } from "@shared/hooks";
import { EmptyState, ErrorState, WeekSwitcher } from "@shared/ui";

import { useMarkPayout } from "../../hooks/useMarkPayout";
import { MarkPaidSheet } from "../mark-paid-sheet";
import { PayoutRow } from "../payout-row";

// The weekly payout to merchants - the same report as the backend's
// `npm run report:payouts`.
export const PayoutReport = () => {
  // The week in the URL - linkable from «Все долги»; without it, the previous
  // week: the one to pay for (the backend's default is the current one).
  const [weekParam, setWeekParam] = useSearchParamState("week");

  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const marking = useMarkPayout();

  // The current week as the backend sees it (Bishkek, not the device clock).
  const { report: current } = usePayoutWeekQuery(null);

  const week = weekParam ?? (current ? shiftIsoDate(current.from, -7) : undefined);

  const { report, isLoading, isError, isFetching, retry } = usePayoutWeekQuery(week);

  const shift = (from: string, days: number) => {
    haptic.selection();
    setWeekParam(shiftIsoDate(from, days));
  };

  const currency = t("certificate.currency");

  const markingRow =
    marking.target && report?.from === marking.target.week
      ? report.merchants.find((row) => row.merchantId === marking.target?.merchantId)
      : undefined;

  const isCurrentWeek = report !== undefined && report.from === current?.from;

  return (
    <div className="flex flex-col gap-4">
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
                navigateTo(getAdminOrdersRoute({ status: "needs_review" }), { replace: true });
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
                      onMarkPaid={() => marking.open({ merchantId: row.merchantId, week: report.from })}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      {/* Closes by itself if the refetched row has nothing left to pay. */}
      {report && markingRow && markingRow.due > 0 && (
        <MarkPaidSheet
          merchantId={markingRow.merchantId}
          merchantName={markingRow.merchantName}
          amount={markingRow.due}
          from={report.from}
          to={report.to}
          isPending={marking.isPending}
          onConfirm={(note) => marking.confirm(markingRow, note)}
          onCancel={marking.close}
        />
      )}
    </div>
  );
};

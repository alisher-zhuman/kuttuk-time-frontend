import { useState } from "react";

import { useTranslation } from "react-i18next";

import { ChevronLeft, ChevronRight, TriangleAlert, Wallet } from "lucide-react";

import { usePayoutWeekQuery } from "@entities/payout";

import { getAdminMerchantDetailRoute, getAdminOrdersRoute } from "@shared/constants";
import { formatIsoDate, formatMoney, shiftIsoDate } from "@shared/helpers";
import { useHaptic, useNavigateTo } from "@shared/hooks";
import { EmptyState, ErrorState } from "@shared/ui";

import { PayoutRow } from "../payout-row";

// The weekly payout to merchants — the same report as the backend's
// `npm run report:payouts`. Week switching works like the owner's summary.
export const PayoutReport = () => {
  // null = the current week; otherwise any date inside the shown week.
  const [week, setWeek] = useState<string | null>(null);

  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const { report, isLoading, isError, isFetching, retry } = usePayoutWeekQuery(week);

  // Which week is "current" is the backend's call (Bishkek time) — read it from
  // the default request instead of the device clock.
  const { report: current } = usePayoutWeekQuery(null);

  const currency = t("certificate.currency");

  const goTo = (from: string, days: number) => {
    haptic.selection();

    const target = shiftIsoDate(from, days);

    setWeek(target === current?.from ? null : target);
  };

  const isCurrentWeek = report !== undefined && report.from === current?.from;

  return (
    <div className="flex flex-col gap-4 mt-3.5 pb-5">
      <h1 className="text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight">
        {t("admin.payouts.title")}
      </h1>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={!report}
          onClick={() => report && goTo(report.from, -7)}
          className="flex items-center gap-1 px-3 py-2 rounded-full bg-(--color-chip) text-sm font-semibold text-(--color-ink) cursor-pointer disabled:opacity-50"
        >
          <ChevronLeft size={16} />
          {t("merchant.summary.prev")}
        </button>

        <span className="text-sm font-bold text-(--color-slate) text-center">
          {report
            ? t("merchant.summary.week", { from: formatIsoDate(report.from), to: formatIsoDate(report.to) })
            : "…"}
        </span>

        {report && !isCurrentWeek ? (
          <button
            type="button"
            onClick={() => goTo(report.from, 7)}
            className="flex items-center gap-1 px-3 py-2 rounded-full bg-(--color-chip) text-sm font-semibold text-(--color-ink) cursor-pointer"
          >
            {t("merchant.summary.next")}
            <ChevronRight size={16} />
          </button>
        ) : (
          <span className="w-20" />
        )}
      </div>

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
                    />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
};

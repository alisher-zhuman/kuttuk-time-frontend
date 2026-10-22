import { useState } from "react";

import { useTranslation } from "react-i18next";

import { VenueFilter } from "@features/venue-filter";

import { useMerchantSummaryQuery } from "@entities/merchant";

import { formatMoney } from "@shared/helpers";
import { useWeekParam } from "@shared/hooks";
import { ErrorState, WeekSwitcher } from "@shared/ui";

export const WeekSummary = () => {
  // null = all the owner's venues.
  const [venueId, setVenueId] = useState<number | null>(null);

  const { t } = useTranslation();

  // The current week as the backend sees it — see useWeekParam. Without the
  // venue filter: the week is the same for every venue, so one cached request.
  const { summary: current } = useMerchantSummaryQuery(null, null);

  const { week, shift } = useWeekParam(current?.from);

  const { summary, isLoading, isError, isFetching, retry } = useMerchantSummaryQuery(week, venueId);

  const currency = t("certificate.currency");

  const isCurrentWeek = summary !== undefined && summary.from === current?.from;

  // Only for the whole merchant (no venue filter) — payouts are per merchant.
  const payoutStatus = (() => {
    if (summary?.paidOut === undefined || summary.due === undefined) return null;
    if (summary.paidOut === 0 && summary.due === 0) return null;
    if (summary.due === 0) return { text: t("merchant.summary.payoutStatus.paidOut"), tone: "text-(--color-green)" };
    if (summary.paidOut === 0) return { text: t("merchant.summary.payoutStatus.pending"), tone: "text-(--color-hint)" };

    return {
      text: t("merchant.summary.payoutStatus.partial", {
        paid: formatMoney(summary.paidOut, currency),
        due: formatMoney(summary.due, currency)
      }),
      tone: "text-(--color-amber)"
    };
  })();

  const rows = summary && [
    { key: "sold", text: t("merchant.summary.sold", { count: summary.sold.count, amount: formatMoney(summary.sold.amount, currency) }) },
    { key: "commission", text: t("merchant.summary.commission", { amount: formatMoney(summary.commission, currency) }) },
    { key: "payout", text: t("merchant.summary.payout", { amount: formatMoney(summary.payout, currency) }), accent: true },
    ...(payoutStatus ? [{ key: "payoutStatus", text: payoutStatus.text, tone: payoutStatus.tone }] : []),
    { key: "redeemed", text: t("merchant.summary.redeemed", { count: summary.redeemed.count, amount: formatMoney(summary.redeemed.amount, currency) }) }
  ];

  return (
    <div className="flex flex-col gap-4 mt-3.5 pb-5">
      <h1 className="text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight">
        {t("merchant.summary.title")}
      </h1>

      <VenueFilter active={venueId} onChange={setVenueId} />

      <WeekSwitcher range={summary} isCurrent={isCurrentWeek} onShift={shift} />

      {isError ? (
        <ErrorState onRetry={retry} isRetrying={isFetching} />
      ) : isLoading || !rows ? (
        <div className="h-48 rounded-2xl bg-(--color-chip) animate-pulse" />
      ) : (
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-(--color-card) border border-(--color-line)">
          {rows.map((row) => (
            <span
              key={row.key}
              className={
                "tone" in row
                  ? `-mt-2 text-sm font-bold ${row.tone}`
                  : "accent" in row && row.accent
                    ? "text-base font-extrabold text-(--color-primary)"
                    : "text-sm font-semibold text-(--color-ink)"
              }
            >
              {row.text}
            </span>
          ))}
        </div>
      )}

      {/* Redeemed counts certificates used this week whatever their sale date,
          so it can exceed "sold" — say so before anyone reads it as a bug. */}
      <p className="text-xs text-(--color-hint) px-1">{t("merchant.summary.redeemedHint")}</p>
    </div>
  );
};

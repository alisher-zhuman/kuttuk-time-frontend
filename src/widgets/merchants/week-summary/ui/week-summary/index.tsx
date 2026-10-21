import { useState } from "react";

import { useTranslation } from "react-i18next";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { VenueFilter } from "@features/venue-filter";

import { useMerchantSummaryQuery } from "@entities/merchant";

import { formatIsoDate, formatMoney, shiftIsoDate } from "@shared/helpers";
import { useHaptic } from "@shared/hooks";
import { ErrorState } from "@shared/ui";

export const WeekSummary = () => {
  // null = the current week; otherwise any date inside the shown week.
  const [week, setWeek] = useState<string | null>(null);
  // null = all the owner's venues.
  const [venueId, setVenueId] = useState<number | null>(null);

  const { t } = useTranslation();

  const haptic = useHaptic();

  const { summary, isLoading, isError, isFetching, retry } = useMerchantSummaryQuery(week, venueId);

  // Which week is "current" is the backend's call (Bishkek time) — read it from
  // the default request (cached after the first load) instead of the device clock.
  const { summary: current } = useMerchantSummaryQuery(null, venueId);

  const currency = t("certificate.currency");

  const goTo = (from: string, days: number) => {
    haptic.selection();

    const target = shiftIsoDate(from, days);

    setWeek(target === current?.from ? null : target);
  };

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

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={!summary}
          onClick={() => summary && goTo(summary.from, -7)}
          className="flex items-center gap-1 px-3 py-2 rounded-full bg-(--color-chip) text-sm font-semibold text-(--color-ink) cursor-pointer disabled:opacity-50"
        >
          <ChevronLeft size={16} />
          {t("merchant.summary.prev")}
        </button>

        <span className="text-sm font-bold text-(--color-slate) text-center">
          {summary
            ? t("merchant.summary.week", { from: formatIsoDate(summary.from), to: formatIsoDate(summary.to) })
            : "…"}
        </span>

        {summary && !isCurrentWeek ? (
          <button
            type="button"
            onClick={() => goTo(summary.from, 7)}
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

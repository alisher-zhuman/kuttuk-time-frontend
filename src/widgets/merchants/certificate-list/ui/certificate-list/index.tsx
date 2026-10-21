import { useState } from "react";

import { useTranslation } from "react-i18next";

import { Gift, Loader2, ScanLine } from "lucide-react";

import { VenueFilter } from "@features/venue-filter";

import { type CertificateStatus, useMerchantCertificatesQuery } from "@entities/certificate";
import { useMerchantMeQuery } from "@entities/merchant";

import { getRedeemRoute } from "@shared/constants";
import { useHaptic, useLoadMoreOnScroll, useNavigateTo } from "@shared/hooks";
import { ChipSelect, EmptyState, ErrorState } from "@shared/ui";

import { CertificateRow } from "../certificate-row";

type Tab = "all" | CertificateStatus;

const TABS: Tab[] = ["all", "active", "used", "expired"];

export const CertificateList = () => {
  const [tab, setTab] = useState<Tab>("all");
  // null = all the owner's venues.
  const [venueId, setVenueId] = useState<number | null>(null);

  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const {
    certificates,
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    retry
  } = useMerchantCertificatesQuery(tab === "all" ? null : tab, venueId);

  const { merchant } = useMerchantMeQuery();

  // Which venue sold a code matters only when the owner has several and the
  // list isn't already narrowed to one.
  const showVenue = venueId === null && (merchant?.venues.length ?? 0) > 1;

  const setSentinel = useLoadMoreOnScroll(fetchNextPage, hasNextPage && !isFetchingNextPage);

  return (
    <div className="flex flex-col gap-4 mt-3.5 pb-5">
      <h1 className="text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight">
        {t("merchant.certificates.title")}
      </h1>

      {/* Redeeming lives on this tab: the list refetches after it, so the owner
          comes back and sees the code marked used. A plain button, not the
          MainButton — that one is the redeem screen's own "Redeem". */}
      <button
        type="button"
        onClick={() => {
          haptic.light();
          navigateTo(getRedeemRoute());
        }}
        className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-(--color-primary) text-(--color-card) text-sm font-bold cursor-pointer"
      >
        <ScanLine size={18} />
        {t("merchant.certificates.redeem")}
      </button>

      <VenueFilter active={venueId} onChange={setVenueId} />

      <ChipSelect
        items={TABS.map((value) => ({ value, label: t(`merchant.certificates.tabs.${value}`) }))}
        isSelected={(value) => value === tab}
        onSelect={setTab}
      />

      {isLoading ? (
        <ul className="flex flex-col gap-2.5 list-none">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="h-20 rounded-2xl bg-(--color-chip) animate-pulse" />
          ))}
        </ul>
      ) : isError ? (
        <ErrorState onRetry={retry} isRetrying={isFetching} />
      ) : certificates.length === 0 ? (
        <EmptyState icon={<Gift size={32} strokeWidth={1.5} />} message={t("certificates.empty")} />
      ) : (
        <ul className="flex flex-col gap-2.5 list-none">
          {certificates.map((certificate) => (
            <li key={certificate.code}>
              <CertificateRow
                certificate={certificate}
                showVenue={showVenue}
                onRedeem={() => navigateTo(getRedeemRoute(certificate.code))}
              />
            </li>
          ))}

          <li ref={setSentinel} className="flex justify-center py-2">
            {isFetchingNextPage && (
              <Loader2 size={20} color="var(--color-hint)" className="animate-spin" />
            )}
          </li>
        </ul>
      )}
    </div>
  );
};

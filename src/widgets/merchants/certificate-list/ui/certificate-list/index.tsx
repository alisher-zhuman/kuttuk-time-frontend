import { useState } from "react";

import { useTranslation } from "react-i18next";

import { Gift } from "lucide-react";

import { VenueFilter } from "@features/venue-filter";

import {
  type CertificateStatus,
  type MerchantCertificate,
  useMerchantCertificatesQuery
} from "@entities/certificate";
import { useMerchantMeQuery } from "@entities/merchant";

import { useLoadMoreOnScroll } from "@shared/hooks";
import { ChipSelect, EmptyState, ErrorState, LoadMore } from "@shared/ui";

import { CertificateRow } from "../certificate-row";
import { CertificateSheet } from "../certificate-sheet";
import { CodeLookup } from "../code-lookup";

type Tab = "all" | CertificateStatus;

const TABS: Tab[] = ["all", "active", "used", "expired"];

export const CertificateList = () => {
  const [tab, setTab] = useState<Tab>("all");
  // null = all the owner's venues.
  const [venueId, setVenueId] = useState<number | null>(null);
  // The row whose card is open in the sheet.
  const [opened, setOpened] = useState<MerchantCertificate | null>(null);

  const { t } = useTranslation();

  const {
    certificates,
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    isLoadMoreError,
    hasNextPage,
    fetchNextPage,
    retry
  } = useMerchantCertificatesQuery(tab === "all" ? null : tab, venueId);

  const { merchant } = useMerchantMeQuery();

  // Which venue sold a code matters only when the owner has several and the
  // list isn't already narrowed to one.
  const showVenue = venueId === null && (merchant?.venues.length ?? 0) > 1;

  const setSentinel = useLoadMoreOnScroll(
    fetchNextPage,
    // Stop on a failed page — the footer's retry takes over.
    hasNextPage && !isFetchingNextPage && !isLoadMoreError
  );

  return (
    <div className="flex flex-col gap-4 mt-3.5 pb-5">
      <h1 className="text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight">
        {t("merchant.certificates.title")}
      </h1>

      {/* Redeeming lives here: type the code → its card → "Redeem". The list
          below refetches after it. */}
      <CodeLookup />

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
                onOpen={() => setOpened(certificate)}
              />
            </li>
          ))}

          <LoadMore
            sentinelRef={setSentinel}
            isLoading={isFetchingNextPage}
            isError={isLoadMoreError}
            onRetry={fetchNextPage}
          />
        </ul>
      )}

      {opened && <CertificateSheet certificate={opened} onClose={() => setOpened(null)} />}
    </div>
  );
};

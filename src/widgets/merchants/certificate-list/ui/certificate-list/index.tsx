import { useState } from "react";

import { useTranslation } from "react-i18next";

import { Gift, Loader2 } from "lucide-react";

import { type CertificateStatus, useMerchantCertificatesQuery } from "@entities/certificate";

import { ChipSelect, EmptyState, ErrorState } from "@shared/ui";

import { useLoadMoreOnScroll } from "../../hooks/useLoadMoreOnScroll";
import { CertificateRow } from "../certificate-row";

type Tab = "all" | CertificateStatus;

const TABS: Tab[] = ["all", "active", "used", "expired"];

export const CertificateList = () => {
  const [tab, setTab] = useState<Tab>("all");

  const { t } = useTranslation();

  const {
    certificates,
    isLoading,
    isError,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    retry
  } = useMerchantCertificatesQuery(tab === "all" ? null : tab);

  const setSentinel = useLoadMoreOnScroll(fetchNextPage, hasNextPage && !isFetchingNextPage);

  return (
    <div className="flex flex-col gap-4 mt-3.5 pb-5">
      <h1 className="text-xl font-extrabold tracking-tight text-(--color-ink) leading-tight">
        {t("merchant.certificates.title")}
      </h1>

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
              <CertificateRow certificate={certificate} />
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

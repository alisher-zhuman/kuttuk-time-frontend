import { useTranslation } from "react-i18next";

import { Gift } from "lucide-react";

import {
  CertificateCard,
  CertificateCardSkeleton,
  useMyCertificatesQuery
} from "@entities/certificate";

import { getCertificateRoute, ROUTE_PATTERNS } from "@shared/constants";
import { useHaptic, useNavigateTo } from "@shared/hooks";
import { EmptyState, ErrorState, PillButton } from "@shared/ui";

// Cards visible without scrolling on a phone.
const ABOVE_THE_FOLD = 4;

export const CertificatesTab = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const { certificates, isLoading, isError, isFetching, retry } = useMyCertificatesQuery();

  if (isLoading) {
    return (
      <ul className="flex flex-col gap-2.5 list-none">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i}>
            <CertificateCardSkeleton />
          </li>
        ))}
      </ul>
    );
  }

  if (isError) {
    return <ErrorState onRetry={retry} isRetrying={isFetching} />;
  }

  if (certificates.length === 0) {
    return (
      <EmptyState
        icon={<Gift size={32} strokeWidth={1.5} />}
        message={t("certificates.empty")}
        action={
          <PillButton
            onClick={() => {
              haptic.light();
              navigateTo(ROUTE_PATTERNS.HOME);
            }}
          >
            {t("certificates.toCatalog")}
          </PillButton>
        }
      />
    );
  }

  // Order comes from the backend: active first, newest first within a status.
  return (
    <ul className="flex flex-col gap-2.5 list-none">
      {certificates.map((certificate, index) => (
        <li key={certificate.id}>
          <CertificateCard
            certificate={certificate}
            priority={index < ABOVE_THE_FOLD}
            onOpen={
              certificate.status === "active"
                ? () => {
                    haptic.light();
                    navigateTo(getCertificateRoute(certificate.id));
                  }
                : undefined
            }
          />
        </li>
      ))}
    </ul>
  );
};

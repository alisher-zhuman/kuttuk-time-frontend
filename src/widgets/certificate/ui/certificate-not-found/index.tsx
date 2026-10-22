import { useTranslation } from "react-i18next";

import { Gift } from "lucide-react";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useHaptic, useNavigateTo } from "@shared/hooks";
import { EmptyState, PillButton } from "@shared/ui";

export const CertificateNotFound = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  return (
    <EmptyState
      variant="page"
      icon={<Gift size={32} strokeWidth={1.5} />}
      message={t("certificates.notFound")}
      action={
        <PillButton
          onClick={() => {
            haptic.light();
            navigateTo(ROUTE_PATTERNS.PROFILE, { replace: true });
          }}
        >
          {t("certificates.toList")}
        </PillButton>
      }
    />
  );
};

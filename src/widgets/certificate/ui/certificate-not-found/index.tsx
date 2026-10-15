import { useTranslation } from "react-i18next";

import { Gift } from "lucide-react";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useHaptic, useNavigateTo } from "@shared/hooks";
import { EmptyState } from "@shared/ui";

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
        <button
          type="button"
          onClick={() => {
            haptic.light();
            navigateTo(ROUTE_PATTERNS.PROFILE, { replace: true });
          }}
          className="px-6 py-3 rounded-full bg-(--color-primary) text-(--color-card) font-semibold text-sm cursor-pointer"
        >
          {t("certificates.toList")}
        </button>
      }
    />
  );
};

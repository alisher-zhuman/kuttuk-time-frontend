import { useTranslation } from "react-i18next";

import { Gift } from "lucide-react";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useHaptic, useNavigateTo } from "@shared/hooks";
import { EmptyState, PillButton } from "@shared/ui";

// Unknown, malformed, or replaced by a newer «Подарить» - the giver sent again.
export const GiftNotFound = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  return (
    <EmptyState
      variant="page"
      icon={<Gift size={32} strokeWidth={1.5} />}
      message={t("gift.notFound")}
      action={
        <PillButton
          onClick={() => {
            haptic.light();
            navigateTo(ROUTE_PATTERNS.HOME, { replace: true });
          }}
        >
          {t("certificates.toCatalog")}
        </PillButton>
      }
    />
  );
};

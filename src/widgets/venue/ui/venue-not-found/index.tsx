import { useTranslation } from "react-i18next";

import { Store } from "lucide-react";

import { ROUTE_PATTERNS } from "@shared/constants";
import { canGoBack } from "@shared/helpers";
import { useHaptic, useNavigateTo } from "@shared/hooks";
import { EmptyState, PillButton } from "@shared/ui";

export const VenueNotFound = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  return (
    <EmptyState
      variant="page"
      icon={<Store size={32} strokeWidth={1.5} />}
      message={t("venue.notFound")}
      action={
        <PillButton
          onClick={() => {
            haptic.light();

            if (canGoBack()) {
              navigateTo(-1);
            } else {
              navigateTo(ROUTE_PATTERNS.HOME);
            }
          }}
        >
          {t("notFound.goBack")}
        </PillButton>
      }
    />
  );
};

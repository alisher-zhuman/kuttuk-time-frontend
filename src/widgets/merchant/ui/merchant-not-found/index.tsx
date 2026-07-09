import { useTranslation } from "react-i18next";

import { Store } from "lucide-react";

import { ROUTE_PATTERNS } from "@shared/constants";
import { canGoBack } from "@shared/helpers";
import { useHaptic, useNavigateTo } from "@shared/hooks";
import { EmptyState } from "@shared/ui";

export const MerchantNotFound = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  return (
    <EmptyState
      variant="page"
      icon={<Store size={32} strokeWidth={1.5} />}
      message={t("merchantDetail.notFound")}
      action={
        <button
          type="button"
          onClick={() => {
            haptic.light();

            if (canGoBack()) {
              navigateTo(-1);
            } else {
              navigateTo(ROUTE_PATTERNS.HOME);
            }
          }}
          className="px-6 py-3 rounded-full bg-(--color-primary) text-(--color-card) font-semibold text-sm cursor-pointer"
        >
          {t("notFound.goBack")}
        </button>
      }
    />
  );
};

import { useTranslation } from "react-i18next";

import { Receipt } from "lucide-react";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useHaptic, useNavigateTo } from "@shared/hooks";
import { EmptyState } from "@shared/ui";

export const OrderNotFound = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  return (
    <EmptyState
      variant="page"
      icon={<Receipt size={32} strokeWidth={1.5} />}
      message={t("orders.errors.notFound")}
      action={
        <button
          type="button"
          onClick={() => {
            haptic.light();
            navigateTo(ROUTE_PATTERNS.HOME, { replace: true });
          }}
          className="px-6 py-3 rounded-full bg-(--color-primary) text-(--color-card) font-semibold text-sm cursor-pointer"
        >
          {t("notFound.goHome")}
        </button>
      }
    />
  );
};

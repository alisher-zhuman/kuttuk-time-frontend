import { useTranslation } from "react-i18next";

import { UsersRound } from "lucide-react";

import { AdminMerchantCard, useAdminMerchantsQuery } from "@entities/merchant";
import { AdminVenueCardSkeleton } from "@entities/venue";

import { getAdminMerchantDetailRoute } from "@shared/constants";
import { useHaptic, useNavigateTo } from "@shared/hooks";
import { EmptyState, ErrorState } from "@shared/ui";

interface Props {
  search: string;
  isActive: boolean | null;
}

export const MerchantList = ({ search, isActive }: Props) => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const { merchants, isLoading, isError, isFetching, retry } = useAdminMerchantsQuery({
    search,
    isActive
  });

  return (
    <section aria-label={t("admin.merchants.listTitle")}>
      <h2 className="text-xs font-bold text-(--color-hint) tracking-wider pt-5.5 pb-2.5 px-1">
        {t("admin.merchants.listTitle")}
      </h2>

      {isLoading ? (
        <ul className="pb-5 flex flex-col gap-2.5 list-none">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i}>
              {/* Same card frame as the merchant card. */}
              <AdminVenueCardSkeleton />
            </li>
          ))}
        </ul>
      ) : isError ? (
        <ErrorState onRetry={retry} isRetrying={isFetching} />
      ) : merchants.length === 0 ? (
        <EmptyState
          icon={<UsersRound size={32} strokeWidth={1.5} />}
          message={t("admin.merchants.empty")}
        />
      ) : (
        <ul className="pb-5 flex flex-col gap-2.5 list-none">
          {merchants.map((merchant) => (
            <li key={merchant.id}>
              <AdminMerchantCard
                merchant={merchant}
                onClick={() => {
                  haptic.light();
                  navigateTo(getAdminMerchantDetailRoute(merchant.id));
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

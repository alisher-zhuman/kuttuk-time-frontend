import { useTranslation } from "react-i18next";

import { Store } from "lucide-react";

import { AdminVenueCard, AdminVenueCardSkeleton, useAdminVenuesQuery } from "@entities/venue";

import { getAdminVenueDetailRoute } from "@shared/constants";
import { useHaptic, useNavigateTo } from "@shared/hooks";
import { EmptyState, ErrorState } from "@shared/ui";

interface Props {
  search: string;
  category: number | null;
  isActive: boolean | null;
}

export const VenueList = ({ search, category, isActive }: Props) => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const { venues, isLoading, isError, isFetching, retry } = useAdminVenuesQuery({
    search,
    category,
    isActive,
    merchantId: null
  });

  return (
    <section aria-label={t("admin.venues.listTitle")}>
      <h2 className="text-xs font-bold text-(--color-hint) tracking-wider pt-5.5 pb-2.5 px-1">
        {t("admin.venues.listTitle")}
      </h2>

      {isLoading ? (
        <ul className="pb-5 flex flex-col gap-2.5 list-none">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i}>
              <AdminVenueCardSkeleton />
            </li>
          ))}
        </ul>
      ) : isError ? (
        <ErrorState onRetry={retry} isRetrying={isFetching} />
      ) : venues.length === 0 ? (
        <EmptyState icon={<Store size={32} strokeWidth={1.5} />} message={t("admin.venues.empty")} />
      ) : (
        <ul className="pb-5 flex flex-col gap-2.5 list-none">
          {venues.map((venue) => (
            <li key={venue.id}>
              <AdminVenueCard
                venue={venue}
                onClick={() => {
                  haptic.light();
                  navigateTo(getAdminVenueDetailRoute(venue.id));
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

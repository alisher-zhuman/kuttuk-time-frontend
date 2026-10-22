import { useTranslation } from "react-i18next";

import { Store } from "lucide-react";

import { VenueDetail, VenueDetailSkeleton } from "@widgets/venues/venue-detail";

import { useCategoriesQuery } from "@entities/category";
import { MerchantDeactivatedNotice, useMerchantMeQuery } from "@entities/merchant";

import { getOwnVenueEditRoute } from "@shared/constants";
import { useNavigateTo } from "@shared/hooks";
import { EmptyState, ErrorState } from "@shared/ui";

export const MerchantCabinetPage = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const { merchant, isLoading, isError, isFetching, retry } = useMerchantMeQuery();

  const { categories } = useCategoriesQuery();

  if (isLoading) return <VenueDetailSkeleton />;

  if (isError || !merchant) {
    return <ErrorState onRetry={retry} isRetrying={isFetching} />;
  }

  return (
    <div className="flex-1 flex flex-col gap-4 pt-4">
      {/* Deactivated: the backend rejects edits with 403, so explain why
          instead of offering an edit that can only fail. */}
      {!merchant.isActive && <MerchantDeactivatedNotice />}

      {merchant.venues.length === 0 ? (
        <EmptyState
          icon={<Store size={32} strokeWidth={1.5} />}
          message={t("merchant.cabinet.noVenues")}
        />
      ) : (
        <section aria-label={t("merchant.cabinet.venuesTitle")}>
          <h2 className="text-xs font-bold text-(--color-hint) tracking-wider pt-2 px-1">
            {t("merchant.cabinet.venuesTitle")}
          </h2>

          <div className="flex flex-col divide-y divide-(--color-line)">
            {merchant.venues.map((venue) => (
              <VenueDetail
                key={venue.id}
                venue={venue}
                categories={categories}
                onEdit={
                  merchant.isActive ? () => navigateTo(getOwnVenueEditRoute(venue.id)) : undefined
                }
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

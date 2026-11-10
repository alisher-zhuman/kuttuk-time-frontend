import { useParams } from "react-router";

import { VenueDetail, VenueDetailSkeleton, VenueNotFound } from "@widgets/venues/venue-detail";

import { useCategoriesQuery } from "@entities/category";
import { useAdminMerchantQuery } from "@entities/merchant";
import { useAdminVenueQuery } from "@entities/venue";

import {
  getAdminMerchantDetailRoute,
  getAdminOrdersRoute,
  getAdminVenueEditRoute
} from "@shared/constants";
import { useNavigateTo } from "@shared/hooks";
import { ErrorState } from "@shared/ui";

export const VenueDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const navigateTo = useNavigateTo();

  const { venue, isLoading, isError, isNotFound, isFetching, retry } = useAdminVenueQuery(id);

  // Only for the owner's name - the venue itself carries just merchantId.
  const { merchant } = useAdminMerchantQuery(venue ? String(venue.merchantId) : undefined);

  const { categories } = useCategoriesQuery();

  if (isLoading) return <VenueDetailSkeleton />;
  if (isNotFound) return <VenueNotFound />;
  if (isError || !venue) return <ErrorState onRetry={retry} isRetrying={isFetching} />;

  return (
    <VenueDetail
      venue={venue}
      categories={categories}
      onEdit={() => navigateTo(getAdminVenueEditRoute(venue.id))}
      onOpenOrders={() => navigateTo(getAdminOrdersRoute({ venueId: venue.id }))}
      owner={
        merchant && {
          name: merchant.name,
          onOpen: () => navigateTo(getAdminMerchantDetailRoute(merchant.id))
        }
      }
    />
  );
};

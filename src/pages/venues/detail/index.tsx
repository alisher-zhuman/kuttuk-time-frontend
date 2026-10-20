import { useParams } from "react-router";

import { VenueDetail, VenueDetailSkeleton, VenueNotFound } from "@widgets/venues/venue-detail";

import { useCategoriesQuery } from "@entities/category";
import { useAdminMerchantQuery } from "@entities/merchant";
import { useAdminVenueQuery } from "@entities/venue";

import { getAdminMerchantDetailRoute, getAdminVenueEditRoute } from "@shared/constants";
import { useNavigateTo } from "@shared/hooks";

export const VenueDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const navigateTo = useNavigateTo();

  const { venue, isLoading, isError } = useAdminVenueQuery(id);

  // Only for the owner's name — the venue itself carries just merchantId.
  const { merchant } = useAdminMerchantQuery(venue ? String(venue.merchantId) : undefined);

  const { categories } = useCategoriesQuery();

  if (isLoading) return <VenueDetailSkeleton />;
  if (isError || !venue) return <VenueNotFound />;

  return (
    <VenueDetail
      venue={venue}
      categories={categories}
      onEdit={() => navigateTo(getAdminVenueEditRoute(venue.id))}
      owner={
        merchant && {
          name: merchant.name,
          onOpen: () => navigateTo(getAdminMerchantDetailRoute(merchant.id))
        }
      }
    />
  );
};

import { useParams } from "react-router";

import {
  MerchantDetail,
  MerchantDetailSkeleton,
  MerchantNotFound
} from "@widgets/merchants/merchant-detail";

import { useAdminMerchantQuery } from "@entities/merchant";

import {
  getAdminMerchantEditRoute,
  getAdminVenueCreateRoute,
  getAdminVenueDetailRoute
} from "@shared/constants";
import { useNavigateTo } from "@shared/hooks";

export const MerchantDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const navigateTo = useNavigateTo();

  const { merchant, isLoading, isError } = useAdminMerchantQuery(id);

  if (isLoading) return <MerchantDetailSkeleton />;
  if (isError || !merchant) return <MerchantNotFound />;

  return (
    <MerchantDetail
      merchant={merchant}
      onEdit={() => navigateTo(getAdminMerchantEditRoute(merchant.id))}
      onOpenVenue={(venueId) => navigateTo(getAdminVenueDetailRoute(venueId))}
      onAddVenue={() => navigateTo(getAdminVenueCreateRoute(merchant.id))}
    />
  );
};

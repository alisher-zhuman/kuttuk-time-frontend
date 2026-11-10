import { useParams } from "react-router";

import {
  MerchantDetail,
  MerchantDetailSkeleton,
  MerchantNotFound
} from "@widgets/merchants/merchant-detail";

import { useAdminMerchantQuery } from "@entities/merchant";

import {
  getAdminMerchantEditRoute,
  getAdminOrdersRoute,
  getAdminVenueCreateRoute,
  getAdminVenueDetailRoute
} from "@shared/constants";
import { useNavigateTo } from "@shared/hooks";
import { ErrorState } from "@shared/ui";

export const MerchantDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const navigateTo = useNavigateTo();

  const { merchant, isLoading, isError, isNotFound, isFetching, retry } = useAdminMerchantQuery(id);

  if (isLoading) return <MerchantDetailSkeleton />;
  if (isNotFound) return <MerchantNotFound />;
  if (isError || !merchant) return <ErrorState onRetry={retry} isRetrying={isFetching} />;

  return (
    <MerchantDetail
      merchant={merchant}
      onEdit={() => navigateTo(getAdminMerchantEditRoute(merchant.id))}
      onOpenVenue={(venueId) => navigateTo(getAdminVenueDetailRoute(venueId))}
      onAddVenue={() => navigateTo(getAdminVenueCreateRoute(merchant.id))}
      onOpenOrders={() => navigateTo(getAdminOrdersRoute({ merchantId: merchant.id }))}
    />
  );
};

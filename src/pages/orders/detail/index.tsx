import { useParams } from "react-router";

import { OrderDetail, OrderDetailSkeleton, OrderNotFound } from "@widgets/orders/order-detail";

import { isOrderId, useAdminOrderQuery } from "@entities/order";

import {
  getAdminMerchantDetailRoute,
  getAdminOrdersRoute,
  getAdminVenueDetailRoute
} from "@shared/constants";
import { useNavigateTo } from "@shared/hooks";
import { ErrorState } from "@shared/ui";

export const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const navigateTo = useNavigateTo();

  const validId = id && isOrderId(id) ? id : undefined;

  // A non-uuid would only get a 400 - skip the request.
  const { order, isLoading, isError, isNotFound, isFetching, retry } = useAdminOrderQuery(validId);

  if (!validId || isNotFound) return <OrderNotFound />;
  if (isLoading) return <OrderDetailSkeleton />;
  if (isError || !order) return <ErrorState onRetry={retry} isRetrying={isFetching} />;

  return (
    <OrderDetail
      order={order}
      onOpenVenue={() => navigateTo(getAdminVenueDetailRoute(order.venue.id))}
      onOpenMerchant={() => navigateTo(getAdminMerchantDetailRoute(order.merchant.id))}
      onOpenBuyerOrders={() => navigateTo(getAdminOrdersRoute({ userId: order.buyer.userId }))}
    />
  );
};

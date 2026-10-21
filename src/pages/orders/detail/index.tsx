import { useParams } from "react-router";

import { OrderDetail, OrderDetailSkeleton, OrderNotFound } from "@widgets/orders/order-detail";

import { isOrderId, useAdminOrderQuery } from "@entities/order";

import { getAdminMerchantDetailRoute, getAdminVenueDetailRoute } from "@shared/constants";
import { useNavigateTo } from "@shared/hooks";

export const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const navigateTo = useNavigateTo();

  // A non-uuid would only get a 400 — skip the request.
  const { order, isLoading, isError } = useAdminOrderQuery(id && isOrderId(id) ? id : undefined);

  if (isLoading) return <OrderDetailSkeleton />;
  if (isError || !order) return <OrderNotFound />;

  return (
    <OrderDetail
      order={order}
      onOpenVenue={() => navigateTo(getAdminVenueDetailRoute(order.venue.id))}
      onOpenMerchant={() => navigateTo(getAdminMerchantDetailRoute(order.merchant.id))}
    />
  );
};

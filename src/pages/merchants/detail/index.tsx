import { useParams } from "react-router";

import { MerchantDetail, MerchantDetailSkeleton, MerchantNotFound } from "@widgets/merchants/merchant-detail";

import { useCategoriesQuery } from "@entities/category";
import { useAdminMerchantQuery } from "@entities/merchant";

import { getMerchantEditRoute } from "@shared/constants";
import { useNavigateTo } from "@shared/hooks";

export const MerchantDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const navigateTo = useNavigateTo();

  const { merchant, isLoading, isError } = useAdminMerchantQuery(id);

  const { categories } = useCategoriesQuery();

  if (isLoading) return <MerchantDetailSkeleton />;
  if (isError || !merchant) return <MerchantNotFound />;

  return (
    <MerchantDetail
      merchant={merchant}
      categories={categories}
      onEdit={() => navigateTo(getMerchantEditRoute(merchant.id))}
    />
  );
};

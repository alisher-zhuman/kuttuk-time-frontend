import { useParams } from "react-router";

import {
  AdminMerchantDetailContent,
  AdminMerchantDetailSkeleton,
  AdminMerchantNotFound
} from "@widgets/admin/merchants";

import { useCategoriesQuery } from "@entities/category";
import { useAdminMerchantQuery } from "@entities/merchant";

import { getMerchantEditRoute } from "@shared/constants";
import { useNavigateTo } from "@shared/hooks";

export const AdminMerchantDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const navigateTo = useNavigateTo();

  const { merchant, isLoading, isError } = useAdminMerchantQuery(id);

  const { categories } = useCategoriesQuery();

  if (isLoading) return <AdminMerchantDetailSkeleton />;
  if (isError || !merchant) return <AdminMerchantNotFound />;

  return (
    <AdminMerchantDetailContent
      merchant={merchant}
      categories={categories}
      onEdit={() => navigateTo(getMerchantEditRoute(merchant.id))}
    />
  );
};

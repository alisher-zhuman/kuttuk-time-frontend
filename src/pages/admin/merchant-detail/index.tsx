import { useParams } from "react-router";

import {
  AdminMerchantDetailContent,
  AdminMerchantDetailSkeleton,
  AdminMerchantNotFound
} from "@widgets/admin/merchants";

import { useAdminCategoriesQuery } from "@entities/category";
import { useAdminMerchantQuery } from "@entities/merchant";

export const AdminMerchantDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { merchant, isLoading, isError } = useAdminMerchantQuery(id);

  const { categories } = useAdminCategoriesQuery();

  if (isLoading) return <AdminMerchantDetailSkeleton />;
  if (isError || !merchant) return <AdminMerchantNotFound />;

  return (
    <AdminMerchantDetailContent merchant={merchant} categories={categories} />
  );
};

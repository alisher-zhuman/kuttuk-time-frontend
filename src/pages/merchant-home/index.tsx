import { useTranslation } from "react-i18next";

import { Store } from "lucide-react";

import {
  AdminMerchantDetailContent,
  AdminMerchantDetailSkeleton
} from "@widgets/admin/merchants";

import { useCategoriesQuery } from "@entities/category";
import { useMerchantMeQuery } from "@entities/merchant";

import { EmptyState } from "@shared/ui";

export const MerchantHomePage = () => {
  const { t } = useTranslation();

  const { merchant, isLoading, isError } = useMerchantMeQuery();

  const { categories } = useCategoriesQuery();

  if (isLoading) return <AdminMerchantDetailSkeleton />;

  if (isError || !merchant) {
    return (
      <EmptyState
        variant="page"
        icon={<Store size={32} strokeWidth={1.5} />}
        message={t("merchant.home.loadError")}
      />
    );
  }

  return (
    <AdminMerchantDetailContent merchant={merchant} categories={categories} />
  );
};

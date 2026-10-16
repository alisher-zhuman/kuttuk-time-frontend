import { useTranslation } from "react-i18next";

import { Store } from "lucide-react";

import {
  AdminMerchantDetailContent,
  AdminMerchantDetailSkeleton
} from "@widgets/admin/merchants";

import { useCategoriesQuery } from "@entities/category";
import { MerchantDeactivatedNotice, useMerchantMeQuery } from "@entities/merchant";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useNavigateTo } from "@shared/hooks";
import { EmptyState } from "@shared/ui";

export const MerchantHomePage = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

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

  // Deactivated: the backend rejects PATCH /merchants/me with 403, so explain
  // why instead of offering an edit that can only fail.
  if (!merchant.isActive) {
    return (
      <div className="flex-1 flex flex-col pt-4">
        <MerchantDeactivatedNotice />

        <AdminMerchantDetailContent merchant={merchant} categories={categories} />
      </div>
    );
  }

  return (
    <AdminMerchantDetailContent
      merchant={merchant}
      categories={categories}
      onEdit={() => navigateTo(ROUTE_PATTERNS.MERCHANT_PROFILE_EDIT)}
    />
  );
};

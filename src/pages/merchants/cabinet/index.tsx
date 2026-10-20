import { useTranslation } from "react-i18next";

import { Store } from "lucide-react";

import { CabinetMenu } from "@widgets/merchants/cabinet-menu";
import { MerchantDetail, MerchantDetailSkeleton } from "@widgets/merchants/merchant-detail";

import { useCategoriesQuery } from "@entities/category";
import { MerchantDeactivatedNotice, useMerchantMeQuery } from "@entities/merchant";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useMainButton, useNavigateTo } from "@shared/hooks";
import { EmptyState } from "@shared/ui";

export const MerchantCabinetPage = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const { merchant, isLoading, isError } = useMerchantMeQuery();

  const { categories } = useCategoriesQuery();

  // The cabinet's main action. Shown when deactivated too: a deactivated
  // venue can still redeem what it sold.
  useMainButton({
    text: t("merchant.redeem.entry"),
    onClick: () => navigateTo(ROUTE_PATTERNS.MERCHANT_REDEEM),
    hidden: !merchant
  });

  if (isLoading) return <MerchantDetailSkeleton />;

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
      <div className="flex-1 flex flex-col gap-4 pt-4">
        <MerchantDeactivatedNotice />

        <CabinetMenu />

        <MerchantDetail merchant={merchant} categories={categories} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4 pt-4">
      <CabinetMenu />

      <MerchantDetail
        merchant={merchant}
        categories={categories}
        onEdit={() => navigateTo(ROUTE_PATTERNS.MERCHANT_PROFILE_EDIT)}
      />
    </div>
  );
};

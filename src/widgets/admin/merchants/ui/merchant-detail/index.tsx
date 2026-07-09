import { useTranslation } from "react-i18next";

import { type Category } from "@entities/category";
import { type AdminMerchantDetail } from "@entities/merchant";

import { formatMoney } from "@shared/helpers";

import { MerchantDetailChips } from "../merchant-detail-chips";
import { MerchantDetailDescription } from "../merchant-detail-description";
import { MerchantDetailHeader } from "../merchant-detail-header";
import { MerchantDetailMeta } from "../merchant-detail-meta";

interface Props {
  merchant: AdminMerchantDetail;
  categories: Category[];
  onEdit: () => void;
}

export const AdminMerchantDetailContent = ({ merchant, categories, onEdit }: Props) => {
  const { t } = useTranslation();

  const merchantCategories = categories.filter((category) =>
    merchant.categories.includes(category.id)
  );

  const currency = t("certificate.currency");

  return (
    <div className="flex-1 flex flex-col py-4 gap-5">
      <MerchantDetailHeader
        logo={merchant.logo}
        name={merchant.name}
        slug={merchant.slug}
        isActive={merchant.isActive}
        onEdit={onEdit}
      />

      {merchant.description && (
        <MerchantDetailDescription description={merchant.description} />
      )}

      {merchantCategories.length > 0 && (
        <MerchantDetailChips
          label={t("admin.merchants.detail.categories")}
          items={merchantCategories.map((category) => ({
            key: category.id,
            label: category.name
          }))}
        />
      )}

      <MerchantDetailChips
        label={t("admin.merchants.detail.nominals")}
        items={merchant.nominals.map((nominal) => ({
          key: nominal,
          label: formatMoney(nominal, currency)
        }))}
      />

      <MerchantDetailMeta
        validityMonths={merchant.validityMonths}
        merchantTelegramId={merchant.merchantTelegramId}
        createdAt={merchant.createdAt}
      />
    </div>
  );
};

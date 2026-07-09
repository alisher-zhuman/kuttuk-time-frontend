import { type Category } from "@entities/category";
import { type AdminMerchantDetail } from "@entities/merchant";

import { MerchantDetailCategories } from "../merchant-detail-categories";
import { MerchantDetailDescription } from "../merchant-detail-description";
import { MerchantDetailHeader } from "../merchant-detail-header";
import { MerchantDetailMeta } from "../merchant-detail-meta";
import { MerchantDetailNominals } from "../merchant-detail-nominals";

interface Props {
  merchant: AdminMerchantDetail;
  categories: Category[];
  onEdit: () => void;
}

export const AdminMerchantDetailContent = ({ merchant, categories, onEdit }: Props) => {
  const merchantCategories = categories.filter((category) =>
    merchant.categories.includes(category.id)
  );

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
        <MerchantDetailCategories categories={merchantCategories} />
      )}

      <MerchantDetailNominals nominals={merchant.nominals} />

      <MerchantDetailMeta
        validityMonths={merchant.validityMonths}
        merchantTelegramId={merchant.merchantTelegramId}
        createdAt={merchant.createdAt}
      />
    </div>
  );
};

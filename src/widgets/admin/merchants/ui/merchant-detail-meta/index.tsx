import { useTranslation } from "react-i18next";

import { formatDate } from "@shared/helpers";

import { MerchantDetailMetaField } from "../merchant-detail-meta-field";

interface Props {
  validityMonths: number;
  merchantTelegramId: number;
  createdAt: string;
}

export const MerchantDetailMeta = ({
  validityMonths,
  merchantTelegramId,
  createdAt
}: Props) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
      <MerchantDetailMetaField
        label={t("admin.merchants.detail.validity")}
        value={t("admin.merchants.detail.validityValue", { months: validityMonths })}
      />

      <MerchantDetailMetaField
        label={t("admin.merchants.detail.telegramId")}
        value={merchantTelegramId}
      />

      <MerchantDetailMetaField
        label={t("admin.merchants.detail.createdAt")}
        value={formatDate(createdAt)}
      />
    </div>
  );
};

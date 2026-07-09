import { useTranslation } from "react-i18next";

import { formatDate } from "@shared/helpers";
import { FieldLabel } from "@shared/ui";

interface FieldProps {
  label: string;
  value: string | number;
}

const MetaField = ({ label, value }: FieldProps) => (
  <div className="flex flex-col gap-1">
    <FieldLabel>{label}</FieldLabel>

    <p className="text-sm font-bold text-(--color-ink) px-1">{value}</p>
  </div>
);

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
      <MetaField
        label={t("admin.merchants.detail.validity")}
        value={t("admin.merchants.detail.validityValue", { months: validityMonths })}
      />

      <MetaField
        label={t("admin.merchants.detail.telegramId")}
        value={merchantTelegramId}
      />

      <MetaField
        label={t("admin.merchants.detail.createdAt")}
        value={formatDate(createdAt)}
      />
    </div>
  );
};

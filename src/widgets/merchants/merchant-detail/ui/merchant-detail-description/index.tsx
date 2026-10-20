import { useTranslation } from "react-i18next";

import { FieldLabel } from "@shared/ui";

interface Props {
  description: { ru: string; kg: string; en: string };
}

export const MerchantDetailDescription = ({ description }: Props) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="flex flex-col gap-1">
      <FieldLabel>{t("admin.merchants.detail.description")}</FieldLabel>

      <p className="text-sm text-(--color-ink) font-medium px-1">
        {description[i18n.language as keyof typeof description]}
      </p>
    </div>
  );
};

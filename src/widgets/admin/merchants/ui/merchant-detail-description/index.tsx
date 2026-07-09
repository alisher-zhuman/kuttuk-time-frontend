import { useTranslation } from "react-i18next";

interface Props {
  description: { ru: string; kg: string; en: string };
}

export const MerchantDetailDescription = ({ description }: Props) => {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <p className="text-xs font-bold text-(--color-hint) tracking-widest px-1 pb-1">
        {t("admin.merchants.detail.description")}
      </p>
      <p className="text-sm text-(--color-ink) font-medium px-1">
        {description[i18n.language as keyof typeof description]}
      </p>
    </div>
  );
};

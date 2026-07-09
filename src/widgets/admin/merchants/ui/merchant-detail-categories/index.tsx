import { useTranslation } from "react-i18next";

interface Props {
  categories: { id: number; name: string }[];
}

export const MerchantDetailCategories = ({ categories }: Props) => {
  const { t } = useTranslation();

  return (
    <div>
      <p className="text-xs font-bold text-(--color-hint) tracking-widest px-1 pb-2.5">
        {t("admin.merchants.detail.categories")}
      </p>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <span
            key={category.id}
            className="px-3 py-1.5 rounded-full text-sm font-bold bg-(--color-chip) text-(--color-chip-ink) border border-(--color-line)"
          >
            {category.name}
          </span>
        ))}
      </div>
    </div>
  );
};

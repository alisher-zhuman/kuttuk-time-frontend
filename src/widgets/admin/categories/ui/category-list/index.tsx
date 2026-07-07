import { useTranslation } from "react-i18next";

import { Tag } from "lucide-react";

import {
  CategoryCard,
  CategoryCardSkeleton,
  useCategoriesQuery,
} from "@entities/category";

export const CategoryList = () => {
  const { t } = useTranslation();

  const { categories, isLoading } = useCategoriesQuery();

  return (
    <section aria-label={t("admin.categories.listTitle")}>
      <h2 className="text-xs font-bold text-(--color-hint) tracking-wider pt-5.5 pb-2.5 px-1">
        {t("admin.categories.listTitle")}
      </h2>

      {isLoading ? (
        <ul className="pb-5 flex flex-col gap-2 list-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <CategoryCardSkeleton />
            </li>
          ))}
        </ul>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-14 text-(--color-hint)">
          <span className="size-16 rounded-2xl bg-(--color-chip) flex items-center justify-center">
            <Tag size={32} strokeWidth={1.5} />
          </span>

          <p className="text-sm font-semibold">{t("admin.categories.empty")}</p>
        </div>
      ) : (
        <ul className="pb-5 flex flex-col gap-2 list-none">
          {categories.map((category) => (
            <li key={category.id}>
              <CategoryCard category={category} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

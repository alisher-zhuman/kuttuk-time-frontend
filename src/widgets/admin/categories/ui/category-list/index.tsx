import { useTranslation } from "react-i18next";

import { DragDropProvider } from "@dnd-kit/react";
import { Tag } from "lucide-react";

import {
  CategoryCardSkeleton,
  useAdminCategoriesQuery,
} from "@entities/category";

import { getCategoryEditRoute } from "@shared/constants";
import { useHaptic, useNavigateTo } from "@shared/hooks";

import { useCategoryReorder } from "../../hooks/useCategoryReorder";
import { SortableCategoryItem } from "../sortable-category-item";

export const CategoryList = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const { categories, isLoading } = useAdminCategoriesQuery();

  const { handleDragEnd } = useCategoryReorder(categories);

  return (
    <section aria-label={t("admin.categories.listTitle")}>
      <h2 className="text-xs font-bold text-(--color-hint) tracking-wider pt-5.5 pb-2.5 px-1">
        {t("admin.categories.listTitle")}
      </h2>

      {isLoading ? (
        <ul className="pb-5 flex flex-col gap-2 list-none">
          {Array.from({ length: 10 }).map((_, i) => (
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
        <DragDropProvider onDragEnd={handleDragEnd}>
          <ul className="pb-5 flex flex-col gap-2 list-none">
            {categories.map((category, index) => (
              <SortableCategoryItem
                index={index}
                key={category.id}
                category={category}
                onClick={() => {
                  haptic.light();
                  navigateTo(getCategoryEditRoute(category.id));
                }}
              />
            ))}
          </ul>
        </DragDropProvider>
      )}
    </section>
  );
};

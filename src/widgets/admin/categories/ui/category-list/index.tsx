import { useState } from "react";

import { useTranslation } from "react-i18next";

import { DragDropProvider } from "@dnd-kit/react";
import { Tag } from "lucide-react";

import {
  CategoryCardSkeleton,
  useAdminCategoriesQuery
} from "@entities/category";

import { getCategoryEditRoute } from "@shared/constants";
import { useHaptic, useNavigateTo } from "@shared/hooks";
import { EmptyState } from "@shared/ui";

import { useCategoryDelete } from "../../hooks/useCategoryDelete";
import { useCategoryReorder } from "../../hooks/useCategoryReorder";
import { SortableCategoryItem } from "../sortable-category-item";

export const CategoryList = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const { categories, isLoading } = useAdminCategoriesQuery();

  const { handleDragStart, handleDragEnd } = useCategoryReorder(categories);

  const { handleDelete } = useCategoryDelete();

  const [listElement, setListElement] = useState<HTMLUListElement | null>(null);

  return (
    <section aria-label={t("admin.categories.listTitle")}>
      <h2 className="text-xs font-bold text-(--color-hint) tracking-wider pt-5.5 pb-2.5 px-1">
        {t("admin.categories.listTitle")}
      </h2>

      {isLoading ? (
        <ul className="pb-5 flex flex-col gap-2 list-none">
          {Array.from({ length: 11 }).map((_, i) => (
            <li key={i}>
              <CategoryCardSkeleton />
            </li>
          ))}
        </ul>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<Tag size={32} strokeWidth={1.5} />}
          message={t("admin.categories.empty")}
        />
      ) : (
        <DragDropProvider
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <ul
            ref={setListElement}
            className="pb-5 flex flex-col gap-2 list-none"
          >
            {categories.map((category, index) => (
              <SortableCategoryItem
                index={index}
                key={category.id}
                category={category}
                listElement={listElement}
                onClick={() => {
                  haptic.light();
                  navigateTo(getCategoryEditRoute(category.id));
                }}
                onDelete={() => void handleDelete(category.id)}
              />
            ))}
          </ul>
        </DragDropProvider>
      )}
    </section>
  );
};

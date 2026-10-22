import { useParams } from "react-router";

import { useTranslation } from "react-i18next";

import { Tag } from "lucide-react";

import { CategoryForm } from "@widgets/categories/category-form";

import { useAdminCategoriesQuery } from "@entities/category";

import { EmptyState, PageLoader } from "@shared/ui";

export const CategoryEditPage = () => {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();

  const { categories, isLoading } = useAdminCategoriesQuery();

  const category = categories.find((c) => c.id === Number(id));

  if (isLoading) {
    return <PageLoader />;
  }

  if (!category) {
    return (
      <EmptyState
        variant="page"
        icon={<Tag size={32} strokeWidth={1.5} />}
        message={t("admin.categories.notFound")}
      />
    );
  }

  return <CategoryForm category={category} />;
};

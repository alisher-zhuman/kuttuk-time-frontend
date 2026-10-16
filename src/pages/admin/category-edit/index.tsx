import { useParams } from "react-router";

import { useTranslation } from "react-i18next";

import { Loader2, Tag } from "lucide-react";

import { CategoryForm } from "@features/admin/category-form";

import { useAdminCategoriesQuery } from "@entities/category";

import { EmptyState } from "@shared/ui";

export const AdminCategoryEditPage = () => {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();

  const { categories, isLoading } = useAdminCategoriesQuery();

  const category = categories.find((c) => c.id === Number(id));

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 size={28} color="var(--color-hint)" className="animate-spin" />
      </div>
    );
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

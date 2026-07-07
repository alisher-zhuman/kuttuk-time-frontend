import { useTranslation } from "react-i18next";

import { Plus } from "lucide-react";

import { CategoryList } from "@widgets/admin/categories";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useHaptic, useNavigateTo, useSafeArea } from "@shared/hooks";

export const AdminCategoriesPage = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const haptic = useHaptic();

  const insets = useSafeArea();

  return (
    <>
      <CategoryList />

      <div className="h-20" />

      <button
        type="button"
        onClick={() => {
          haptic.light();
          navigateTo(ROUTE_PATTERNS.ADMIN_CATEGORIES_NEW);
        }}
        className="fixed z-20 flex items-center justify-center gap-2 h-12 rounded-2xl bg-(--color-primary) text-(--color-card) font-bold text-sm cursor-pointer"
        style={{
          bottom: insets.bottom + 16,
          left: insets.left + 16,
          right: insets.right + 16,
          boxShadow: "var(--shadow-card)",
        }}
      >
        <Plus size={18} />
        {t("admin.categories.create")}
      </button>
    </>
  );
};

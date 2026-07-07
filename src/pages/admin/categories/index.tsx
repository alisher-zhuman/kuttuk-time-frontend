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
      <div style={{ paddingBottom: insets.bottom + 80 }}>
        <CategoryList />
      </div>

      <button
        type="button"
        aria-label={t("admin.categories.create")}
        onClick={() => {
          haptic.light();
          navigateTo(ROUTE_PATTERNS.ADMIN_CATEGORY_CREATE);
        }}
        className="fixed z-20 flex items-center justify-center size-14 rounded-full bg-(--color-primary) text-(--color-card) cursor-pointer"
        style={{
          bottom: insets.bottom + 16,
          right: insets.right + 16,
          boxShadow: "var(--shadow-card)",
        }}
      >
        <Plus size={24} />
      </button>
    </>
  );
};

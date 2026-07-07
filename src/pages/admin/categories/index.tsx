import { useTranslation } from "react-i18next";

import { Plus } from "lucide-react";

import { CategoryList } from "@widgets/admin/categories";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useNavigateTo, useSafeArea } from "@shared/hooks";
import { Fab } from "@shared/ui";

export const AdminCategoriesPage = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  const insets = useSafeArea();

  return (
    <>
      {/* 72 = высота Fab (56) + отступ от края (16) */}
      <div style={{ paddingBottom: insets.bottom + 72 }}>
        <CategoryList />
      </div>

      <Fab
        ariaLabel={t("admin.categories.create")}
        onClick={() => navigateTo(ROUTE_PATTERNS.ADMIN_CATEGORY_CREATE)}
      >
        <Plus size={24} />
      </Fab>
    </>
  );
};

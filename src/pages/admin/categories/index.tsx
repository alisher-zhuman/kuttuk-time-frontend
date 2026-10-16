import { useTranslation } from "react-i18next";

import { Plus } from "lucide-react";

import { CategoryList } from "@widgets/admin/categories";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useNavigateTo } from "@shared/hooks";
import { Fab } from "@shared/ui";

export const AdminCategoriesPage = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  return (
    <>
      <CategoryList />

      <Fab
        ariaLabel={t("admin.categories.create")}
        onClick={() => navigateTo(ROUTE_PATTERNS.ADMIN_CATEGORY_CREATE)}
      >
        <Plus size={24} />
      </Fab>
    </>
  );
};

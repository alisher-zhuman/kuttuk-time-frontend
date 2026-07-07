import { useTranslation } from "react-i18next";

import { CategoryList } from "@widgets/admin/categories";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useMainButton, useNavigateTo } from "@shared/hooks";

export const AdminCategoriesPage = () => {
  const { t } = useTranslation();

  const navigateTo = useNavigateTo();

  useMainButton({
    text: t("admin.categories.create"),
    onClick: () => navigateTo(ROUTE_PATTERNS.ADMIN_CATEGORIES_NEW),
  });

  return <CategoryList />;
};

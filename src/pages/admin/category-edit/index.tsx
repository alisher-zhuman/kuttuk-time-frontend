import { useParams } from "react-router";

import { CategoryEditForm } from "@features/admin/category-edit";

export const AdminCategoryEditPage = () => {
  const { id } = useParams<{ id: string }>();

  return <CategoryEditForm categoryId={Number(id)} />;
};

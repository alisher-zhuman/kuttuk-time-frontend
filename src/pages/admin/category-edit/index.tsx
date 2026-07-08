import { useParams } from "react-router";

import { CategoryForm } from "@features/admin/category-form";

export const AdminCategoryEditPage = () => {
  const { id } = useParams<{ id: string }>();

  return <CategoryForm categoryId={Number(id)} />;
};

import { api } from "@shared/api";
import { CategoriesSchema } from "@shared/schemas";

export const getCategories = async (): Promise<string[]> => {
  const response = await api.get("/merchants/categories");

  return CategoriesSchema.parse(response.data);
};

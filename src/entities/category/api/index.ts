import { api } from "@shared/api";
import { API_PATHS } from "@shared/constants";

import { AdminCategoriesSchema, CategoriesSchema } from "../model/schemas";

export const getCategories = async () => {
  const response = await api.get(API_PATHS.CATEGORIES);

  return CategoriesSchema.parse(response.data);
};

export const getAdminCategories = async () => {
  const response = await api.get(API_PATHS.ADMIN_CATEGORIES);

  return AdminCategoriesSchema.parse(response.data);
};

interface CreateCategoryPayload {
  name: { ru: string; kg: string; en: string };
  order?: number;
}

export const createCategory = async (payload: CreateCategoryPayload) => {
  await api.post(API_PATHS.ADMIN_CATEGORIES, payload);
};

interface EditCategoryPayload {
  id: number;
  name: { ru: string; kg: string; en: string };
}

export const editCategory = async ({ id, name }: EditCategoryPayload) => {
  await api.patch(`${API_PATHS.ADMIN_CATEGORIES}/${id}`, { name });
};

import { api } from "@shared/api";
import { API_PATHS } from "@shared/constants";

import { CategoriesSchema } from "../model/schemas";

export const getCategories = async () => {
  const response = await api.get(API_PATHS.CATEGORIES);

  return CategoriesSchema.parse(response.data);
};

interface CreateCategoryPayload {
  name: { ru: string; kg: string; en: string };
  order?: number;
}

export const createCategory = async (payload: CreateCategoryPayload) => {
  await api.post(API_PATHS.ADMIN_CATEGORIES, payload);
};

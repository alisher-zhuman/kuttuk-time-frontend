import { api } from "@shared/api";
import { API_PATHS } from "@shared/constants";

import {
  AdminMerchantDetailSchema,
  AdminMerchantsSchema,
  MerchantDetailSchema,
  MerchantsSchema
} from "../model/schemas";

interface GetAdminMerchantsParams {
  search?: string;
  category?: number | null;
  isActive?: boolean | null;
}

export const getAdminMerchants = async (params: GetAdminMerchantsParams = {}) => {
  const response = await api.get(API_PATHS.ADMIN_MERCHANTS, {
    params: {
      ...(params.search && { search: params.search }),
      ...(params.category != null && { category: params.category }),
      ...(params.isActive != null && { isActive: params.isActive })
    }
  });

  return AdminMerchantsSchema.parse(response.data);
};

interface GetMerchantsParams {
  search?: string;
  category?: number | null;
}

export const getMerchants = async (params: GetMerchantsParams = {}) => {
  const response = await api.get(API_PATHS.MERCHANTS, {
    params: {
      ...(params.search && { search: params.search }),
      ...(params.category != null && { category: params.category })
    }
  });

  return MerchantsSchema.parse(response.data);
};

export const getMerchant = async (id: string | number) => {
  const response = await api.get(`${API_PATHS.MERCHANTS}/${id}`);

  return MerchantDetailSchema.parse(response.data);
};

export const getAdminMerchant = async (id: string | number) => {
  const response = await api.get(`${API_PATHS.ADMIN_MERCHANTS}/${id}`);

  return AdminMerchantDetailSchema.parse(response.data);
};

export interface CreateMerchantPayload {
  name: string;
  description: { ru: string; kg: string; en: string };
  categories: number[];
  nominals: number[];
  validityMonths: number;
  logo: string;
  merchantTelegramId: number;
  slug: string;
}

export const createMerchant = async (payload: CreateMerchantPayload) => {
  await api.post(API_PATHS.ADMIN_MERCHANTS, payload);
};

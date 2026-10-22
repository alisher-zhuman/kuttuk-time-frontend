import { api } from "@shared/api";
import { API_PATHS } from "@shared/constants";

import {
  AdminMerchantDetailSchema,
  AdminMerchantSchema,
  AdminMerchantsSchema,
  MerchantMeSchema,
  MerchantWeekSummarySchema
} from "../model/schemas";

export const getMerchantMe = async () => {
  const response = await api.get(`${API_PATHS.MERCHANTS}/me`);

  return MerchantMeSchema.parse(response.data);
};

// week: any "YYYY-MM-DD" inside the week, null → the current week;
// venueId null → all the merchant's venues.
export const getMerchantSummary = async (week: string | null, venueId: number | null) => {
  const response = await api.get(`${API_PATHS.MERCHANTS}/me/summary`, {
    params: { ...(week && { week }), ...(venueId != null && { venueId }) }
  });

  return MerchantWeekSummarySchema.parse(response.data);
};

export const getAdminMerchants = async (params: { search: string; isActive: boolean | null }) => {
  const response = await api.get(API_PATHS.ADMIN_MERCHANTS, {
    params: {
      ...(params.search && { search: params.search }),
      ...(params.isActive != null && { isActive: params.isActive })
    }
  });

  return AdminMerchantsSchema.parse(response.data);
};

export const getAdminMerchant = async (id: string | number) => {
  const response = await api.get(`${API_PATHS.ADMIN_MERCHANTS}/${id}`);

  return AdminMerchantDetailSchema.parse(response.data);
};

export interface CreateMerchantPayload {
  name: string;
  telegramId: number;
}

export const createMerchant = async (payload: CreateMerchantPayload) => {
  const response = await api.post(API_PATHS.ADMIN_MERCHANTS, payload);

  return AdminMerchantSchema.parse(response.data);
};

export interface UpdateMerchantPayload extends CreateMerchantPayload {
  isActive: boolean;
}

export const updateMerchant = async (id: number, payload: UpdateMerchantPayload) => {
  const response = await api.patch(`${API_PATHS.ADMIN_MERCHANTS}/${id}`, payload);

  return AdminMerchantSchema.parse(response.data);
};

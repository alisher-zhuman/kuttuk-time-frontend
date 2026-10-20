import { api } from "@shared/api";
import { API_PATHS } from "@shared/constants";

import {
  AdminVenueDetailSchema,
  AdminVenuesSchema,
  ManagedVenueSchema,
  VenueDetailSchema,
  VenueOptionsSchema,
  VenuesSchema
} from "../model/schemas";

export const getVenues = async (params: { search: string; category: number | null }) => {
  const response = await api.get(API_PATHS.VENUES, {
    params: {
      ...(params.search && { search: params.search }),
      ...(params.category != null && { category: params.category })
    }
  });

  return VenuesSchema.parse(response.data);
};

export const getVenue = async (idOrSlug: string | number) => {
  const response = await api.get(`${API_PATHS.VENUES}/${idOrSlug}`);

  return VenueDetailSchema.parse(response.data);
};

export const getVenueOptions = async () => {
  const response = await api.get(`${API_PATHS.VENUES}/options`);

  return VenueOptionsSchema.parse(response.data);
};

interface GetAdminVenuesParams {
  search: string;
  category: number | null;
  isActive: boolean | null;
  merchantId: number | null;
}

export const getAdminVenues = async (params: GetAdminVenuesParams) => {
  const response = await api.get(API_PATHS.ADMIN_VENUES, {
    params: {
      ...(params.search && { search: params.search }),
      ...(params.category != null && { category: params.category }),
      ...(params.isActive != null && { isActive: params.isActive }),
      ...(params.merchantId != null && { merchantId: params.merchantId })
    }
  });

  return AdminVenuesSchema.parse(response.data);
};

export const getAdminVenue = async (id: string | number) => {
  const response = await api.get(`${API_PATHS.ADMIN_VENUES}/${id}`);

  return AdminVenueDetailSchema.parse(response.data);
};

// The storefront fields — what the owner may change on its own venue.
export interface VenueStorefrontPayload {
  name: string;
  description: { ru: string; kg: string; en: string };
  categories: number[];
  nominals: number[];
  validityMonths: number;
  logo: string;
}

export interface CreateVenuePayload extends VenueStorefrontPayload {
  merchantId: number;
  slug: string;
}

export const createVenue = async (payload: CreateVenuePayload) => {
  const response = await api.post(API_PATHS.ADMIN_VENUES, payload);

  return AdminVenueDetailSchema.parse(response.data);
};

export interface UpdateVenuePayload extends CreateVenuePayload {
  isActive: boolean;
}

export const updateVenue = async (id: number, payload: UpdateVenuePayload) => {
  const response = await api.patch(`${API_PATHS.ADMIN_VENUES}/${id}`, payload);

  return AdminVenueDetailSchema.parse(response.data);
};

// The owner editing one of its venues — storefront only; slug / isActive /
// owner stay with the admin. 404: not own venue, 403: merchant deactivated.
export const updateOwnVenue = async (venueId: number, payload: VenueStorefrontPayload) => {
  const response = await api.patch(`${API_PATHS.MERCHANTS}/me/venues/${venueId}`, payload);

  return ManagedVenueSchema.parse(response.data);
};

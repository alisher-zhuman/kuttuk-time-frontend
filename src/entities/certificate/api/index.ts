import { api } from "@shared/api";
import { API_PATHS } from "@shared/constants";

import {
  CertificatesSchema,
  MerchantCertificatePageSchema,
  MerchantCertificateSchema,
  PreparedGiftSchema
} from "../model/schemas";
import type { CertificateStatus } from "../model/types";

export const getMyCertificates = async () => {
  const response = await api.get(API_PATHS.MY_CERTIFICATES);

  return CertificatesSchema.parse(response.data);
};

// 8 digits; the backend also ignores spaces and dashes.
const merchantCertificatePath = (code: string) =>
  `${API_PATHS.MERCHANTS}/me/certificates/${encodeURIComponent(code)}`;

export const getMerchantCertificate = async (code: string, signal: AbortSignal) => {
  const response = await api.get(merchantCertificatePath(code), { signal });

  return MerchantCertificateSchema.parse(response.data);
};

export const redeemMerchantCertificate = async (code: string) => {
  const response = await api.post(`${merchantCertificatePath(code)}/redeem`);

  return MerchantCertificateSchema.parse(response.data);
};

// limit is left to the backend (default 50); the cursor is opaque — only ever
// the previous page's nextCursor.
export const getMerchantCertificates = async (
  status: CertificateStatus | null,
  venueId: number | null,
  cursor: string | null,
  signal: AbortSignal
) => {
  const response = await api.get(`${API_PATHS.MERCHANTS}/me/certificates`, {
    params: {
      ...(status && { status }),
      ...(venueId != null && { venueId }),
      ...(cursor && { cursor })
    },
    signal
  });

  return MerchantCertificatePageSchema.parse(response.data);
};

// The card's language is Accept-Language (sent by the api instance).
export const prepareGift = async (id: string) => {
  const response = await api.post(`${API_PATHS.CERTIFICATES}/${id}/share`);

  return PreparedGiftSchema.parse(response.data);
};

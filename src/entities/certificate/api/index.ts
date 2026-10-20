import { api } from "@shared/api";
import { API_PATHS } from "@shared/constants";

import { CertificatesSchema, MerchantCertificateSchema } from "../model/schemas";

export const getMyCertificates = async () => {
  const response = await api.get(API_PATHS.MY_CERTIFICATES);

  return CertificatesSchema.parse(response.data);
};

// The code goes as typed (trimmed by the caller): the backend normalizes case,
// spaces, dashes, an optional KT and Cyrillic look-alikes.
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

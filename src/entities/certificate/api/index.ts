import { api } from "@shared/api";
import { API_PATHS } from "@shared/constants";

import { CertificatesSchema } from "../model/schemas";

export const getMyCertificates = async () => {
  const response = await api.get(API_PATHS.MY_CERTIFICATES);

  return CertificatesSchema.parse(response.data);
};

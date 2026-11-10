import type { CertificateSchema, GiftSchema, MerchantCertificateSchema } from "./schemas";

import type { z } from "zod";

export type Certificate = z.infer<typeof CertificateSchema>;
export type CertificateStatus = Certificate["status"];
export type MerchantCertificate = z.infer<typeof MerchantCertificateSchema>;
export type Gift = z.infer<typeof GiftSchema>;

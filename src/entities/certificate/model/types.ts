import type { CertificateSchema, MerchantCertificateSchema } from "./schemas";

import type { z } from "zod";

export type Certificate = z.infer<typeof CertificateSchema>;
export type CertificateStatus = Certificate["status"];
export type MerchantCertificate = z.infer<typeof MerchantCertificateSchema>;

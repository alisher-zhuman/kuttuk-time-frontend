import type { CertificateSchema } from "./schemas";

import type { z } from "zod";

export type Certificate = z.infer<typeof CertificateSchema>;
export type CertificateStatus = Certificate["status"];

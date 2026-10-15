import type { Certificate } from "./types";

// The one date worth showing per status, with its i18n key.
export const getCertificateDate = (certificate: Certificate) => {
  switch (certificate.status) {
    case "used":
      return { key: "certificate.usedAt", date: certificate.usedAt };
    case "expired":
      return { key: "certificate.expiredAt", date: certificate.validUntil };
    case "active":
      return { key: "certificate.validUntil", date: certificate.validUntil };
  }
};

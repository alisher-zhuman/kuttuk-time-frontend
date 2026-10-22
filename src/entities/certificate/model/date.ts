// Any certificate shape with an effective status — the buyer's list item or
// the one inside an order.
export type DatedCertificate =
  | { status: "active" | "expired"; validUntil: string }
  | { status: "used"; validUntil: string; usedAt: string };

// The one date worth showing per status, with its i18n key.
export const getCertificateDate = (certificate: DatedCertificate) => {
  switch (certificate.status) {
    case "used":
      return { key: "certificate.usedAt", date: certificate.usedAt };
    case "expired":
      return { key: "certificate.expiredAt", date: certificate.validUntil };
    case "active":
      return { key: "certificate.validUntil", date: certificate.validUntil };
  }
};

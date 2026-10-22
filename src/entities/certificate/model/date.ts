// Any certificate shape with an effective status — the buyer's list item or
// the one inside an order.
type Dated =
  | { status: "active" | "expired"; validUntil: string }
  | { status: "used"; validUntil: string; usedAt: string };

// The one date worth showing per status, with its i18n key.
export const getCertificateDate = (certificate: Dated) => {
  switch (certificate.status) {
    case "used":
      return { key: "certificate.usedAt", date: certificate.usedAt };
    case "expired":
      return { key: "certificate.expiredAt", date: certificate.validUntil };
    case "active":
      return { key: "certificate.validUntil", date: certificate.validUntil };
  }
};

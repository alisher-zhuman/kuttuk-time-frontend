// Any certificate shape with an effective status - the buyer's list item or
// the one inside an order. giftedAt - given away and claimed by a friend.
export type DatedCertificate = (
  | { status: "active" | "expired"; validUntil: string }
  | { status: "used"; validUntil: string; usedAt: string }
) & { giftedAt?: string | undefined };

// The one date worth showing per status, with its i18n key. A gifted one shows
// when it was given, and whether the friend used it or let it expire.
export const getCertificateDate = (certificate: DatedCertificate) => {
  if (certificate.giftedAt) {
    const key = {
      active: "certificate.gifted",
      used: "certificate.giftedUsed",
      expired: "certificate.giftedExpired"
    }[certificate.status];

    return { key, date: certificate.giftedAt };
  }

  switch (certificate.status) {
    case "used":
      return { key: "certificate.usedAt", date: certificate.usedAt };
    case "expired":
      return { key: "certificate.expiredAt", date: certificate.validUntil };
    case "active":
      return { key: "certificate.validUntil", date: certificate.validUntil };
  }
};

// Ours to show at the counter and to gift: active and not given away.
export const isUsable = (certificate: DatedCertificate) =>
  certificate.status === "active" && !certificate.giftedAt;

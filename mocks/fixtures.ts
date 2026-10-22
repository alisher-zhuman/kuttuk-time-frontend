// Responses shaped exactly as the backend sends them (../backend services):
// JSON dates as ISO strings, null where a field doesn't apply to the status.

const CLOUDINARY = "https://res.cloudinary.com/demo/image/upload/";

export const ORDER_ID = "22222222-2222-4222-8222-222222222222";

const orderBase = {
  orderId: ORDER_ID,
  amount: 1000,
  venueId: 1,
  expiresAt: "2026-10-21T05:00:00.000Z"
};

// GET /orders/:id — src/orders/orders.service.ts findOwn.
export const orders = {
  pending: { ...orderBase, status: "pending", paymentUrl: "https://pay.finik.test/x", paidAt: null, certificate: null },
  paid: {
    ...orderBase,
    status: "paid",
    paymentUrl: null,
    paidAt: "2026-10-21T04:30:00.000Z",
    certificate: { id: "c1", code: "04718263", validUntil: "2027-10-21T04:30:00.000Z", status: "active" }
  },
  paidUsed: {
    ...orderBase,
    status: "paid",
    paymentUrl: null,
    paidAt: "2026-10-21T04:30:00.000Z",
    certificate: {
      id: "c1",
      code: "04718263",
      validUntil: "2027-10-21T04:30:00.000Z",
      status: "used",
      usedAt: "2026-10-22T08:00:00.000Z"
    }
  },
  paidExpired: {
    ...orderBase,
    status: "paid",
    paymentUrl: null,
    paidAt: "2025-10-21T04:30:00.000Z",
    certificate: { id: "c1", code: "04718263", validUntil: "2026-10-21T04:30:00.000Z", status: "expired" }
  },
  needsReview: { ...orderBase, status: "needs_review", paymentUrl: null, paidAt: "2026-10-21T04:30:00.000Z", certificate: null },
  expired: { ...orderBase, status: "expired", paymentUrl: null, paidAt: null, certificate: null },
  refunded: { ...orderBase, status: "refunded", paymentUrl: null, paidAt: "2026-10-21T04:30:00.000Z", certificate: null }
};

const venueRef = { id: 1, name: "Coffeeroom", slug: "coffeeroom", logo: `${CLOUDINARY}sample.jpg` };

// GET /certificates/my — src/certificates/certificates.service.ts.
export const myCertificates = [
  { id: "c1", code: "04718263", amount: 1000, status: "active", validUntil: "2027-10-21T04:30:00.000Z", createdAt: "2026-10-21T04:30:00.000Z", venue: venueRef },
  { id: "c2", code: "11112222", amount: 500, status: "used", validUntil: "2027-10-21T04:30:00.000Z", usedAt: "2026-10-22T08:00:00.000Z", createdAt: "2026-10-21T04:30:00.000Z", venue: venueRef },
  { id: "c3", code: "33334444", amount: 2000, status: "expired", validUntil: "2026-10-01T00:00:00.000Z", createdAt: "2025-10-01T00:00:00.000Z", venue: venueRef }
];

// GET /merchants/me/certificates/:code (and POST …/redeem).
export const merchantCertificate = (status: "active" | "used" | "expired" = "active") => ({
  code: "04718263",
  amount: 1000,
  status,
  validUntil: "2027-10-21T04:30:00.000Z",
  createdAt: "2026-10-21T04:30:00.000Z",
  venue: { id: 1, name: "Coffeeroom" },
  ...(status === "used" ? { usedAt: "2026-10-22T08:00:00.000Z" } : {})
});

// GET /admin/payouts?week= — src/payouts/admin-payouts.service.ts.
export const payoutWeek = (due = 27) => ({
  from: "2026-10-19",
  to: "2026-10-25",
  merchants: [
    {
      merchantId: 10,
      merchantName: "Coffeeroom",
      ordersCount: 3,
      gross: 30,
      commission: 3,
      payout: 27,
      paidOut: 0,
      due,
      payouts: []
    }
  ],
  total: { ordersCount: 3, gross: 30, commission: 3, payout: 27, paidOut: 0, due },
  needsReviewCount: 0
});

// GET /admin/orders — src/orders/admin-orders.service.ts (status keys only when set).
export const adminOrder = (id: string, status = "paid") => ({
  id,
  amount: 1000,
  status,
  createdAt: "2026-10-21T04:25:00.000Z",
  ...(status === "paid" || status === "needs_review" ? { paidAt: "2026-10-21T04:30:00.000Z" } : {}),
  ...(status === "paid" ? { certificateCode: "04718263" } : {}),
  venue: { id: 1, name: "Coffeeroom" },
  merchant: { id: 10, name: "ИП Асанов" }
});

export const venueOptions = { nominals: [500, 1000, 2000], validityMonths: [6, 12], nameMaxLength: 100 };

// 409 bodies.
export const conflicts = {
  alreadyUsed: { error: "already_used" },
  expired: { error: "expired" },
  nothingToPayOut: { message: "Nothing to pay out", error: "nothing_to_pay_out" },
  amountChanged: { message: "The amount changed", error: "amount_changed" }
};

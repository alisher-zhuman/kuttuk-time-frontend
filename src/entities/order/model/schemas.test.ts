import { fixtures } from "@mocks";
import { describe, expect, it } from "vitest";

import { AdminOrderPageSchema, isOrderId, isOrderStatus, OrderSchema } from "./schemas";

describe("OrderSchema — GET /orders/:id", () => {
  it.each(Object.entries(fixtures.orders))("parses the %s order as the backend sends it", (_, order) => {
    expect(OrderSchema.safeParse(order).success).toBe(true);
  });

  it("drops the nulls a status doesn't use instead of carrying them", () => {
    const order = OrderSchema.parse(fixtures.orders.expired);

    expect(order).not.toHaveProperty("paymentUrl");
    expect(order).not.toHaveProperty("certificate");
  });

  it("keeps the certificate's effective status, usedAt only when used", () => {
    const paid = OrderSchema.parse(fixtures.orders.paidUsed);

    expect(paid.status === "paid" && paid.certificate).toMatchObject({ status: "used", usedAt: "2026-10-22T08:00:00.000Z" });
  });

  it.each([
    ["a paid order without a certificate", { ...fixtures.orders.paid, certificate: null }],
    ["a pending order without a payment URL", { ...fixtures.orders.pending, paymentUrl: null }],
    [
      "a used certificate without usedAt",
      { ...fixtures.orders.paid, certificate: { ...fixtures.orders.paid.certificate, status: "used" } }
    ],
    ["an unknown status", { ...fixtures.orders.expired, status: "lost" }]
  ])("rejects %s", (_, order) => {
    expect(OrderSchema.safeParse(order).success).toBe(false);
  });
});

describe("AdminOrderPageSchema — GET /admin/orders", () => {
  it("parses a page with every status and a cursor", () => {
    const page = {
      items: ["paid", "needs_review", "pending", "expired", "refunded"].map((status, i) =>
        fixtures.adminOrder(`${i}1111111-1111-4111-8111-111111111111`, status)
      ),
      nextCursor: "c2"
    };

    expect(AdminOrderPageSchema.safeParse(page).success).toBe(true);
    expect(AdminOrderPageSchema.safeParse({ items: [], nextCursor: null }).success).toBe(true);
  });
});

describe("guards", () => {
  it("isOrderStatus knows the five statuses and nothing else", () => {
    expect(["pending", "paid", "expired", "needs_review", "refunded"].every(isOrderStatus)).toBe(true);
    expect(isOrderStatus("bogus")).toBe(false);
    expect(isOrderStatus(null)).toBe(false);
  });

  it("isOrderId accepts a uuid only", () => {
    expect(isOrderId(fixtures.ORDER_ID)).toBe(true);
    expect(isOrderId("order_1")).toBe(false);
  });
});

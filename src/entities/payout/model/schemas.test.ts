import { fixtures } from "@mocks";
import { describe, expect, it } from "vitest";

import {
  AmountChangedSchema,
  MarkedPayoutSchema,
  NothingToPayOutSchema,
  PayoutDueSchema,
  PayoutWeekSchema
} from "./schemas";

describe("PayoutWeekSchema - GET /admin/payouts", () => {
  it("parses a week with progress and recorded payouts", () => {
    const week = fixtures.payoutWeek();
    const withMarks = {
      ...week,
      merchants: week.merchants.map((row) => ({
        ...row,
        payouts: [{ id: "p1", payout: 27, ordersCount: 3, paidBy: 4, createdAt: "2026-10-27T04:00:00.000Z", note: "Mbank" }]
      }))
    };

    expect(PayoutWeekSchema.safeParse(week).success).toBe(true);
    expect(PayoutWeekSchema.safeParse(withMarks).success).toBe(true);
  });
});

describe("409 on marking a payout", () => {
  it("tells nothing_to_pay_out from amount_changed", () => {
    expect(NothingToPayOutSchema.safeParse(fixtures.conflicts.nothingToPayOut).success).toBe(true);
    expect(AmountChangedSchema.safeParse(fixtures.conflicts.amountChanged).success).toBe(true);
    expect(AmountChangedSchema.safeParse(fixtures.conflicts.nothingToPayOut).success).toBe(false);
  });
});

describe("PayoutDueSchema - GET /admin/payouts/due", () => {
  it("parses every debt, per merchant and week", () => {
    expect(PayoutDueSchema.parse(fixtures.payoutDue).merchants[0]?.weeks).toHaveLength(2);
  });
});

describe("MarkedPayoutSchema - POST /admin/payouts", () => {
  it("requires ownerNotified - the success message depends on it", () => {
    const marked = { merchantId: 10, from: "2026-10-19", to: "2026-10-25", payout: 27 };

    expect(MarkedPayoutSchema.safeParse({ ...marked, ownerNotified: false }).success).toBe(true);
    expect(MarkedPayoutSchema.safeParse(marked).success).toBe(false);
  });
});

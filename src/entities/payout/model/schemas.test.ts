import { fixtures } from "@mocks";
import { describe, expect, it } from "vitest";

import { AmountChangedSchema, NothingToPayOutSchema, PayoutWeekSchema } from "./schemas";

describe("PayoutWeekSchema — GET /admin/payouts", () => {
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

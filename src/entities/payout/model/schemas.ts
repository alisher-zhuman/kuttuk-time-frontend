import { z } from "zod";

const PayoutTotalsSchema = z.object({
  ordersCount: z.number(),
  gross: z.number(),
  commission: z.number(),
  payout: z.number()
});

// GET /admin/payouts (../backend src/payouts/admin-payouts.service.ts) — the
// same numbers as `npm run report:payouts`. Whole som, payout + commission =
// gross per row and in total: shown as is, never recomputed here.
export const PayoutWeekSchema = z.object({
  from: z.string(),
  to: z.string(),
  merchants: z.array(PayoutTotalsSchema.extend({ merchantId: z.number(), merchantName: z.string() })),
  total: PayoutTotalsSchema,
  // The week's needs_review orders — not paid out until resolved by hand.
  needsReviewCount: z.number()
});

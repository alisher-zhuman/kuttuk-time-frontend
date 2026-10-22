import { z } from "zod";

const PayoutTotalsSchema = z.object({
  ordersCount: z.number(),
  gross: z.number(),
  commission: z.number(),
  payout: z.number(),
  // Already marked paid out for this week / still to pay. due can be a top-up:
  // an order may land in the week after it was marked.
  paidOut: z.number(),
  due: z.number()
});

// GET /admin/payouts (../backend src/payouts/admin-payouts.service.ts) — the
// same numbers as `npm run report:payouts`. Whole som, payout + commission =
// gross per row and in total: shown as is, never recomputed here.
export const PayoutWeekSchema = z.object({
  from: z.string(),
  to: z.string(),
  merchants: z.array(
    PayoutTotalsSchema.extend({
      merchantId: z.number(),
      merchantName: z.string(),
      // Recorded marks for the week, oldest first; a top-up is a second one.
      // Admin-only (the owner never sees the note).
      payouts: z.array(
        z.object({
          id: z.string(),
          payout: z.number(),
          ordersCount: z.number(),
          note: z.string().optional(),
          createdAt: z.string()
        })
      )
    })
  ),
  total: PayoutTotalsSchema,
  // The week's needs_review orders — not paid out until resolved by hand.
  needsReviewCount: z.number()
});

// POST /admin/payouts → the recorded payout; the amount is computed on the
// server, so this is what to show, not the number on screen.
export const MarkedPayoutSchema = z.object({
  merchantId: z.number(),
  from: z.string(),
  to: z.string(),
  payout: z.number()
});

// 409 bodies of POST /admin/payouts — nothing recorded in both cases:
// nothing_to_pay_out — already marked (a double tap, another tab);
// amount_changed — a sale landed while the confirmation was open, so the
// server's amount differs from expectedPayout.
export const NothingToPayOutSchema = z.object({ error: z.literal("nothing_to_pay_out") });
export const AmountChangedSchema = z.object({ error: z.literal("amount_changed") });

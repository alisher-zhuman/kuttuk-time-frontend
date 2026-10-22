import { z } from "zod";

import { ManagedVenueSchema } from "@entities/venue/@x/merchant";

// merchant = the owner's business account (role, cabinet, payouts). Its
// storefronts are venues — one account can own several.

// GET /merchants/me — the account and all its venues (inactive ones too).
export const MerchantMeSchema = z.object({
  id: z.number(),
  name: z.string(),
  isActive: z.boolean(),
  venues: z.array(ManagedVenueSchema)
});

// Admin — GET /admin/merchants (list) and /admin/merchants/:id (+ venues).
export const AdminMerchantSchema = z.object({
  id: z.number(),
  name: z.string(),
  telegramId: z.number(),
  isActive: z.boolean(),
  createdAt: z.string()
});

export const AdminMerchantsSchema = z.array(AdminMerchantSchema);

export const AdminMerchantDetailSchema = AdminMerchantSchema.extend({
  venues: z.array(ManagedVenueSchema)
});

// GET /merchants/me/summary (../backend src/certificates/merchant-cabinet.service.ts
// MerchantWeekSummary) — across all the merchant's venues, or one with
// ?venueId=. from/to are Bishkek calendar dates "YYYY-MM-DD". All amounts are
// whole KGS and match the payout report — never recompute them.
export const MerchantWeekSummarySchema = z.object({
  from: z.string(),
  to: z.string(),
  sold: z.object({ count: z.number(), amount: z.number() }),
  commission: z.number(),
  payout: z.number(),
  redeemed: z.object({ count: z.number(), amount: z.number() }),
  // Only without ?venueId= — payouts are recorded per merchant, not per venue
  // (../backend src/certificates/merchant-cabinet.service.ts).
  paidOut: z.number().optional(),
  due: z.number().optional()
});

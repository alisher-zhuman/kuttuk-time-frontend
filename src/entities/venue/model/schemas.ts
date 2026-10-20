import { z } from "zod";

const TranslationsSchema = z.object({ ru: z.string(), kg: z.string(), en: z.string() });

// Buyer surface — GET /venues (list) and /venues/:idOrSlug (storefront),
// description resolved to one language via Accept-Language.
export const VenueSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  logo: z.string(),
  minNominal: z.number()
});

export const VenuesSchema = z.array(VenueSchema);

export const VenueDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  logo: z.string(),
  nominals: z.array(z.number()).nonempty(),
  validityMonths: z.number()
});

// GET /venues/options (no JWT): VALID_NOMINALS / VALID_VALIDITY_MONTHS sorted
// ascending — the only source of allowed venue values; no frontend list.
export const VenueOptionsSchema = z.object({
  nominals: z.array(z.number()).nonempty(),
  validityMonths: z.array(z.number()).nonempty()
});

// The full, editable venue: items of GET /merchants/me `venues[]` and the
// owner's PATCH /merchants/me/venues/:id response. Raw translations.
export const ManagedVenueSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: TranslationsSchema,
  categories: z.array(z.number()),
  nominals: z.array(z.number()).nonempty(),
  validityMonths: z.number(),
  logo: z.string(),
  slug: z.string(),
  isActive: z.boolean(),
  createdAt: z.string()
});

// Admin — GET /admin/venues (list) and /admin/venues/:id (+ owner merchantId).
export const AdminVenueSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string(),
  isActive: z.boolean(),
  merchantId: z.number()
});

export const AdminVenuesSchema = z.array(AdminVenueSchema);

export const AdminVenueDetailSchema = ManagedVenueSchema.extend({ merchantId: z.number() });

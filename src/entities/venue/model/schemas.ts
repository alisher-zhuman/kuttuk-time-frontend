import { z } from "zod";

const TranslationsSchema = z.object({ ru: z.string(), kg: z.string(), en: z.string() });

// Buyer surface - GET /venues (list) and /venues/:idOrSlug (storefront),
// description resolved to one language via Accept-Language.
export const VenueSchema = z.object({
  id: z.number(),
  // The address of its page (/venues/sierra on the website) - ../backend
  // src/venues/venues.service.ts.
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  logo: z.string(),
  minNominal: z.number()
});

export const VenuesSchema = z.array(VenueSchema);

export const VenueDetailSchema = z.object({
  id: z.number(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  logo: z.string(),
  nominals: z.array(z.number()).nonempty(),
  validityMonths: z.number(),
  // Where it is - required on every venue (../backend src/venues/entities/
  // venue.entity.ts): one address text for every language, and a https map
  // link (2GIS / Google Maps / Yandex Maps only).
  address: z.string(),
  mapUrl: z.string()
});

// GET /venues/options (no JWT): VALID_NOMINALS / VALID_VALIDITY_MONTHS sorted
// ascending - the only source of allowed venue values; no frontend list.
export const VenueOptionsSchema = z.object({
  nominals: z.array(z.number()).nonempty(),
  validityMonths: z.array(z.number()).nonempty(),
  // The backend rejects a longer name (400).
  nameMaxLength: z.number()
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
  // Required - see VenueDetailSchema.
  address: z.string(),
  mapUrl: z.string(),
  isActive: z.boolean(),
  createdAt: z.string()
});

// Admin - GET /admin/venues (list) and /admin/venues/:id (+ owner merchantId).
export const AdminVenueSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string(),
  isActive: z.boolean(),
  merchantId: z.number()
});

export const AdminVenuesSchema = z.array(AdminVenueSchema);

export const AdminVenueDetailSchema = ManagedVenueSchema.extend({ merchantId: z.number() });

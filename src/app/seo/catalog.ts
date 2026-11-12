import { z } from "zod";

const TranslationsSchema = z.object({ ru: z.string(), kg: z.string(), en: z.string() });

// GET /api/public/catalog - the visible catalog in every language, for this
// build only (../backend src/venues/public-catalog.controller.ts).
export const PublicCatalogSchema = z.object({
  venues: z.array(
    z.object({
      id: z.number(),
      slug: z.string(),
      name: z.string(),
      description: TranslationsSchema,
      logo: z.string(),
      categories: z.array(z.number()),
      // Ascending.
      nominals: z.array(z.number()).nonempty(),
      validityMonths: z.number(),
      address: z.string(),
      mapUrl: z.string(),
      updatedAt: z.string()
    })
  ),
  categories: z.array(z.object({ id: z.number(), name: TranslationsSchema, order: z.number() }))
});

export type PublicCatalog = z.infer<typeof PublicCatalogSchema>;
export type PublicVenue = PublicCatalog["venues"][number];

export const EMPTY_CATALOG: PublicCatalog = { venues: [], categories: [] };

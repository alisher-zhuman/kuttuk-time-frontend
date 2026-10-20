import type {
  AdminVenueDetailSchema,
  AdminVenueSchema,
  ManagedVenueSchema,
  VenueDetailSchema,
  VenueOptionsSchema,
  VenueSchema
} from "./schemas";

import type { z } from "zod";

export type Venue = z.infer<typeof VenueSchema>;
export type VenueDetail = z.infer<typeof VenueDetailSchema>;
export type VenueOptions = z.infer<typeof VenueOptionsSchema>;
export type ManagedVenue = z.infer<typeof ManagedVenueSchema>;
export type AdminVenue = z.infer<typeof AdminVenueSchema>;
export type AdminVenueDetail = z.infer<typeof AdminVenueDetailSchema>;

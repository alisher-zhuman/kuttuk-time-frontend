import type { AdminVenueDetail, ManagedVenue } from "@entities/venue";

import type { createVenueFormSchema } from "./schemas";

import type { z } from "zod";

export type VenueFormValues = z.infer<ReturnType<typeof createVenueFormSchema>>;

// One form, three uses — the role decides the fields and the endpoint:
// the admin creates / edits any venue (incl. slug, owner, active status); the
// owner edits only the storefront of its own venue.
export type VenueFormVariant =
  | { kind: "create"; merchantId: number | null }
  | { kind: "edit"; venue: AdminVenueDetail }
  | { kind: "own"; venue: ManagedVenue };

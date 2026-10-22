import { z } from "zod";

import type { VenueOptions } from "@entities/venue";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Static GET /venues/* routes on the backend (RESERVED_SLUGS) — a venue with
// such a slug would be unreachable, so the backend rejects it with 400.
const RESERVED_SLUGS = ["me", "options"];

// Allowed nominals / validity come from the backend, so the schema is built per
// options response. withAdminFields: slug and owner are validated only when
// the admin edits them — the owner's form doesn't show or send them.
// categoryIds: the existing categories, [] while they load (no check then).
export const createVenueFormSchema = (
  options: VenueOptions,
  withAdminFields: boolean,
  categoryIds: number[]
) =>
  z.object({
    logo: z.string().min(1, "venueForm.logoRequired"),
    name: z.string().trim().min(1, "venueForm.required"),
    slug: withAdminFields
      ? z
          .string()
          .trim()
          .min(1, "venueForm.required")
          .regex(SLUG_PATTERN, "venueForm.slugInvalid")
          .refine((value) => !RESERVED_SLUGS.includes(value), {
            message: "venueForm.slugReserved"
          })
      : z.string(),
    merchantId: withAdminFields
      ? z.number().int().positive("venueForm.ownerRequired")
      : z.number(),
    descriptionRu: z.string().trim().min(1, "venueForm.required"),
    descriptionKg: z.string().trim().min(1, "venueForm.required"),
    descriptionEn: z.string().trim().min(1, "venueForm.required"),
    categories: z
      .array(z.number())
      .min(1, "venueForm.categoriesRequired")
      // A category deleted after the venue was saved — the backend rejects it.
      .refine(
        (values) => categoryIds.length === 0 || values.every((id) => categoryIds.includes(id)),
        { message: "venueForm.categoryRemoved" }
      ),
    nominals: z
      .array(z.number())
      .min(1, "venueForm.nominalsRequired")
      // On the array, not each item: the form only renders errors.nominals, so a
      // per-item error would silently block submit.
      .refine((values) => values.every((value) => options.nominals.includes(value)), {
        message: "venueForm.nominalsUnavailable"
      }),
    validityMonths: z
      .number()
      .refine((value) => options.validityMonths.includes(value), {
        message: "venueForm.validityUnavailable"
      }),
    isActive: z.boolean()
  });

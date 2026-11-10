import { fixtures } from "@mocks";
import { describe, expect, it } from "vitest";

import { AdminMerchantDetailSchema, AdminMerchantsSchema } from "./schemas";

describe("AdminMerchantSchema - GET /admin/merchants", () => {
  it("parses the notes and whether the owner is connected", () => {
    const [merchant] = AdminMerchantsSchema.parse([fixtures.adminMerchant()]);

    expect(merchant?.payoutDetails).toBe("Mbank 0555 123 456, Асанов А.");
    expect(merchant?.owner).toEqual({ lastSeenAt: "2026-11-09T08:00:00.000Z", botReachable: true });
  });

  it("takes the backend's nulls - no notes, never opened the app, bot unknown", () => {
    const parsed = AdminMerchantDetailSchema.safeParse(
      fixtures.adminMerchant({ payoutDetails: null, contact: null, owner: { lastSeenAt: null, botReachable: null } })
    );

    expect(parsed.success).toBe(true);
  });
});

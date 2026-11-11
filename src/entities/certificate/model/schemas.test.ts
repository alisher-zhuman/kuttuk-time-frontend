import { fixtures } from "@mocks";
import { describe, expect, it } from "vitest";

import { formatCertificateCode, toCertificateCodeDigits } from "./code";
import {
  CertificateSchema,
  CertificatesSchema,
  GiftConflictSchema,
  GiftSchema,
  MerchantCertificateSchema,
  RedeemConflictSchema
} from "./schemas";

describe("CertificatesSchema - GET /certificates/my", () => {
  it("parses active, used and expired certificates", () => {
    expect(CertificatesSchema.safeParse(fixtures.myCertificates).success).toBe(true);
  });

  it("rejects a used certificate without usedAt", () => {
    const [, used] = fixtures.myCertificates;
    const { usedAt: _, ...withoutUsedAt } = used!;

    expect(CertificatesSchema.safeParse([withoutUsedAt]).success).toBe(false);
  });
});

describe("giftedAt - given away and claimed by a friend", () => {
  it.each(["active", "used"] as const)("keeps giftedAt on a %s certificate", (status) => {
    const parsed = CertificatesSchema.parse([fixtures.giftedCertificate(status)]);

    expect(parsed[0]?.giftedAt).toBe("2026-11-10T06:00:00.000Z");
  });

  it("is optional - an own certificate has no key", () => {
    expect(CertificatesSchema.parse(fixtures.myCertificates)[0]).not.toHaveProperty("giftedAt");
  });
});

describe("the venue on a certificate and a gift says where it is", () => {
  it("rejects a venue without an address or a map link", () => {
    const [certificate] = fixtures.myCertificates;

    expect(CertificatesSchema.safeParse([{ ...certificate, venue: { ...certificate!.venue, address: null } }]).success).toBe(false);
    expect(GiftSchema.safeParse({ ...fixtures.gift(), venue: { ...fixtures.gift().venue, mapUrl: null } }).success).toBe(false);
  });
});

describe("GiftSchema - GET /gifts/:token", () => {
  it.each(["available", "own", "received", "claimed"] as const)("parses state %s", (state) => {
    expect(GiftSchema.safeParse(fixtures.gift(state)).success).toBe(true);
  });

  it("has no code", () => {
    expect(GiftSchema.parse(fixtures.gift())).not.toHaveProperty("code");
  });

  it("the claim answers a certificate as in /certificates/my", () => {
    expect(CertificateSchema.safeParse(fixtures.claimedCertificate).success).toBe(true);
  });

  it.each(["own", "already_claimed", "already_used", "expired"])("knows the 409 %s", (error) => {
    expect(GiftConflictSchema.safeParse({ message: "x", error }).success).toBe(true);
  });
});

describe("MerchantCertificateSchema - the owner's lookup by code", () => {
  it.each(["active", "used", "expired"] as const)("parses a %s certificate", (status) => {
    expect(MerchantCertificateSchema.safeParse(fixtures.merchantCertificate(status)).success).toBe(true);
  });
});

describe("409 on redeem / gift", () => {
  it.each([fixtures.conflicts.alreadyUsed, fixtures.conflicts.expired])("knows %o", (body) => {
    expect(RedeemConflictSchema.safeParse(body).success).toBe(true);
  });

  it("doesn't take another conflict for it", () => {
    expect(RedeemConflictSchema.safeParse(fixtures.conflicts.nothingToPayOut).success).toBe(false);
  });
});

describe("certificate codes are 8 digits, always a string", () => {
  it("shows 0471 8263 and keeps the leading zero", () => {
    expect(formatCertificateCode("04718263")).toBe("0471 8263");
    expect(formatCertificateCode("047182")).toBe("0471 82");
    expect(formatCertificateCode("0471")).toBe("0471");
  });

  it("takes only the digits of what was typed or pasted, at most 8", () => {
    expect(toCertificateCodeDigits("Код: 0471-8263")).toBe("04718263");
    expect(toCertificateCodeDigits("0471 8263 99")).toBe("04718263");
  });
});

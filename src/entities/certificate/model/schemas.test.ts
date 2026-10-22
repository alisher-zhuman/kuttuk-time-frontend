import { fixtures } from "@mocks";
import { describe, expect, it } from "vitest";

import { formatCertificateCode, toCertificateCodeDigits } from "./code";
import { CertificatesSchema, MerchantCertificateSchema, RedeemConflictSchema } from "./schemas";

describe("CertificatesSchema — GET /certificates/my", () => {
  it("parses active, used and expired certificates", () => {
    expect(CertificatesSchema.safeParse(fixtures.myCertificates).success).toBe(true);
  });

  it("rejects a used certificate without usedAt", () => {
    const [, used] = fixtures.myCertificates;
    const { usedAt: _, ...withoutUsedAt } = used!;

    expect(CertificatesSchema.safeParse([withoutUsedAt]).success).toBe(false);
  });
});

describe("MerchantCertificateSchema — the owner's lookup by code", () => {
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

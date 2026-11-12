import { api, fixtures, server } from "@mocks";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests";
import { http, HttpResponse } from "msw/http";
import { describe, expect, it } from "vitest";

import { CertificatesTab } from "./index";

describe("«Мои сертификаты»", () => {
  it("a given-away certificate: «Подарен» and whether the friend used it, no code, doesn't open", async () => {
    server.use(
      http.get(api("/certificates/my"), () =>
        HttpResponse.json([fixtures.myCertificates[0], fixtures.giftedCertificate("used")])
      )
    );
    renderWithProviders(<CertificatesTab />);

    expect(await screen.findByText(/· Подарен 10\.11\.2026 · использован$/)).toBeInTheDocument();
    expect(screen.queryByText("5555 6666")).not.toBeInTheDocument();
    // Only the own active one opens; its code is still there.
    expect(screen.getByText("0471 8263")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Coffeeroom/ })).toHaveLength(1);
  });

  it("keeps the backend's order", async () => {
    server.use(
      http.get(api("/certificates/my"), () =>
        HttpResponse.json([fixtures.giftedCertificate("active"), fixtures.myCertificates[0]])
      )
    );
    renderWithProviders(<CertificatesTab />);

    const gifted = await screen.findByText(/· Подарен 10\.11\.2026$/);
    const own = screen.getByText("0471 8263");

    expect(gifted.compareDocumentPosition(own) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("used and expired ones: one compact row - the venue, the amount and when, no code", async () => {
    server.use(http.get(api("/certificates/my"), () => HttpResponse.json(fixtures.myCertificates)));
    renderWithProviders(<CertificatesTab />);

    await screen.findByText("0471 8263");
    const inactive = fixtures.myCertificates.filter((certificate) => certificate.status !== "active");

    expect(inactive.length).toBeGreaterThan(0);
    for (const certificate of inactive) {
      const shown = certificate.code.replace(/(\d{4})(\d{4})/, "$1 $2");
      expect(screen.queryByText(shown)).not.toBeInTheDocument();
    }
    expect(screen.getAllByRole("button", { name: /Coffeeroom/ })).toHaveLength(1);
  });
});

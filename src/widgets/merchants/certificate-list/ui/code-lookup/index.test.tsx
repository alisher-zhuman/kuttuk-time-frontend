import { api, fixtures, server } from "@mocks";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { popup } from "@tma.js/sdk-react";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

import { CodeLookup } from "./index";

const CODE = "04718263";

// The certificate answers as `status` on lookup; redeem flips it to used, or
// answers 409 when someone else got there first.
const answer = ({ conflict = false } = {}) => {
  const state = { status: "active" as "active" | "used", redeems: 0 };

  server.use(
    http.get(api(`/merchants/me/certificates/${CODE}`), () =>
      HttpResponse.json(fixtures.merchantCertificate(state.status))
    ),
    http.post(api(`/merchants/me/certificates/${CODE}/redeem`), () => {
      state.redeems += 1;
      state.status = "used";

      return conflict
        ? HttpResponse.json(fixtures.conflicts.alreadyUsed, { status: 409 })
        : HttpResponse.json(fixtures.merchantCertificate("used"));
    })
  );

  return state;
};

describe("redeeming by code", () => {
  it("looks the code up once it has 8 digits, typed with spaces", async () => {
    answer();
    renderWithProviders(<CodeLookup />);

    await userEvent.type(screen.getByPlaceholderText("Введите код сертификата"), "0471 82");
    expect(screen.queryByRole("button", { name: "Погасить" })).not.toBeInTheDocument();

    await userEvent.type(screen.getByPlaceholderText("Введите код сертификата"), "63");
    expect(await screen.findByRole("button", { name: "Погасить" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Введите код сертификата")).toHaveValue("0471 8263");
  });

  it("confirms, redeems, clears the field and shows «Сертификат погашен»", async () => {
    const state = answer();
    window.__telegram.replies.popup = "redeem";
    renderWithProviders(<CodeLookup />);

    await userEvent.type(screen.getByPlaceholderText("Введите код сертификата"), CODE);
    await userEvent.click(await screen.findByRole("button", { name: "Погасить" }));

    expect(await screen.findByText("Сертификат погашен")).toBeInTheDocument();
    expect(state.redeems).toBe(1);
    expect(screen.getByPlaceholderText("Введите код сертификата")).toHaveValue("");
    expect(window.__telegram.last("web_app_open_popup")?.["message"]).toContain("0471 8263");
  });

  it("does nothing when the confirmation is cancelled", async () => {
    const state = answer();
    window.__telegram.replies.popup = "cancel";
    renderWithProviders(<CodeLookup />);

    await userEvent.type(screen.getByPlaceholderText("Введите код сертификата"), CODE);
    await userEvent.click(await screen.findByRole("button", { name: "Погасить" }));

    await waitFor(() => expect(window.__telegram.last("web_app_open_popup")).toBeDefined());
    expect(state.redeems).toBe(0);
  });

  it("sends one redeem for a double tap, even if Telegram opens two confirmations", async () => {
    const state = answer();
    // The SDK refuses a second popup while one is open - without that, only
    // our own guard stands between a double tap and two redeems.
    vi.spyOn(popup, "show").mockImplementation(() => Promise.resolve("redeem") as ReturnType<typeof popup.show>);
    renderWithProviders(<CodeLookup />);

    await userEvent.type(screen.getByPlaceholderText("Введите код сертификата"), CODE);
    // Both taps in one frame - before isPending can disable the button.
    const button = await screen.findByRole("button", { name: "Погасить" });
    fireEvent.click(button);
    fireEvent.click(button);

    await screen.findByText("Сертификат погашен");
    expect(state.redeems).toBe(1);
  });

  it("on 409 looks the code up again and shows it was already used", async () => {
    answer({ conflict: true });
    window.__telegram.replies.popup = "redeem";
    renderWithProviders(<CodeLookup />);

    await userEvent.type(screen.getByPlaceholderText("Введите код сертификата"), CODE);
    await userEvent.click(await screen.findByRole("button", { name: "Погасить" }));

    expect(await screen.findByText(/Уже погашен/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Погасить" })).not.toBeInTheDocument();
  });

  it("says «Сертификат не найден» on 404", async () => {
    server.use(http.get(api(`/merchants/me/certificates/${CODE}`), () => HttpResponse.json({}, { status: 404 })));
    renderWithProviders(<CodeLookup />);

    await userEvent.type(screen.getByPlaceholderText("Введите код сертификата"), CODE);

    expect(await screen.findByText("Сертификат не найден")).toBeInTheDocument();
  });

  // A bad connection at the counter: the redeem lands, its answer doesn't.
  const lostAnswer = ({ landed, usedAt = new Date().toISOString() }: { landed: boolean; usedAt?: string }) => {
    const state = { redeems: 0 };

    server.use(
      http.get(api(`/merchants/me/certificates/${CODE}`), () =>
        HttpResponse.json(
          state.redeems > 0 && landed
            ? { ...fixtures.merchantCertificate("used"), usedAt }
            : fixtures.merchantCertificate("active")
        )
      ),
      http.post(api(`/merchants/me/certificates/${CODE}/redeem`), () => {
        state.redeems += 1;
        return HttpResponse.error();
      })
    );

    return state;
  };

  it("a lost answer on a redeem that landed: looks it up and shows success, not «Уже погашен»", async () => {
    lostAnswer({ landed: true });
    window.__telegram.replies.popup = "redeem";
    renderWithProviders(<CodeLookup />);

    await userEvent.type(screen.getByPlaceholderText("Введите код сертификата"), CODE);
    await userEvent.click(await screen.findByRole("button", { name: "Погасить" }));

    expect(await screen.findByText("Сертификат погашен")).toBeInTheDocument();
    expect(screen.queryByText(/Уже погашен/)).not.toBeInTheDocument();
  });

  it("a lost answer on a redeem that didn't land: says «Нет соединения», «Погасить» stays", async () => {
    const state = lostAnswer({ landed: false });
    window.__telegram.replies.popup = "redeem";
    renderWithProviders(<CodeLookup />);

    await userEvent.type(screen.getByPlaceholderText("Введите код сертификата"), CODE);
    await userEvent.click(await screen.findByRole("button", { name: "Погасить" }));

    await waitFor(() =>
      expect(window.__telegram.calls.filter((call) => call.name === "web_app_open_popup")).toHaveLength(2)
    );
    expect(window.__telegram.last("web_app_open_popup")?.["message"]).toContain("Нет соединения");
    expect(state.redeems).toBe(1);
    expect(screen.getByRole("button", { name: "Погасить" })).toBeInTheDocument();
  });

  it("409 right after a lost answer (used a moment ago): success, not an alarm", async () => {
    let redeemed = false;

    server.use(
      http.get(api(`/merchants/me/certificates/${CODE}`), () =>
        HttpResponse.json(
          redeemed
            ? { ...fixtures.merchantCertificate("used"), usedAt: new Date(Date.now() - 30_000).toISOString() }
            : fixtures.merchantCertificate("active")
        )
      ),
      http.post(api(`/merchants/me/certificates/${CODE}/redeem`), () => {
        redeemed = true;
        return HttpResponse.json(fixtures.conflicts.alreadyUsed, { status: 409 });
      })
    );
    window.__telegram.replies.popup = "redeem";
    renderWithProviders(<CodeLookup />);

    await userEvent.type(screen.getByPlaceholderText("Введите код сертификата"), CODE);
    await userEvent.click(await screen.findByRole("button", { name: "Погасить" }));

    expect(await screen.findByText("Сертификат погашен")).toBeInTheDocument();
  });

  it("a failed look-up (5xx / no connection) offers «Повторить»", async () => {
    let failures = 2;
    server.use(
      http.get(api(`/merchants/me/certificates/${CODE}`), () => {
        if (failures > 0) {
          failures -= 1;
          return HttpResponse.json({}, { status: 503 });
        }

        return HttpResponse.json(fixtures.merchantCertificate("active"));
      })
    );
    renderWithProviders(<CodeLookup />);

    await userEvent.type(screen.getByPlaceholderText("Введите код сертификата"), CODE);
    await userEvent.click(await screen.findByRole("button", { name: "Повторить" }, { timeout: 4000 }));

    expect(await screen.findByRole("button", { name: "Погасить" })).toBeInTheDocument();
  });

  it("no «Повторить» for a code that isn't there (404)", async () => {
    server.use(http.get(api(`/merchants/me/certificates/${CODE}`), () => HttpResponse.json({}, { status: 404 })));
    renderWithProviders(<CodeLookup />);

    await userEvent.type(screen.getByPlaceholderText("Введите код сертификата"), CODE);

    expect(await screen.findByText("Сертификат не найден")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Повторить" })).not.toBeInTheDocument();
  });

  it("a scanned QR asks «Погасить?» right away, with the amount and the venue", async () => {
    const state = answer();
    window.__telegram.replies.qr = "04718263";
    window.__telegram.replies.popup = "redeem";
    renderWithProviders(<CodeLookup />);

    await userEvent.click(screen.getByRole("button", { name: "Сканировать QR" }));

    expect(await screen.findByText("Сертификат погашен")).toBeInTheDocument();
    const message = String(window.__telegram.calls.find((call) => call.name === "web_app_open_popup")?.params?.["message"]);
    expect(message).toContain("1 000 сом");
    expect(message).toContain("Coffeeroom");
    expect(state.redeems).toBe(1);
  });

  it("«Отмена» after a scan leaves the card at the counter, asked once", async () => {
    const state = answer();
    window.__telegram.replies.qr = "04718263";
    window.__telegram.replies.popup = "cancel";
    renderWithProviders(<CodeLookup />);

    await userEvent.click(screen.getByRole("button", { name: "Сканировать QR" }));

    expect(await screen.findByRole("button", { name: "Погасить" })).toBeInTheDocument();
    await waitFor(() => expect(window.__telegram.calls.filter((call) => call.name === "web_app_open_popup")).toHaveLength(1));
    expect(state.redeems).toBe(0);
  });

  it("a typed code waits for «Погасить» - no popup by itself", async () => {
    answer();
    renderWithProviders(<CodeLookup />);

    await userEvent.type(screen.getByPlaceholderText("Введите код сертификата"), CODE);

    expect(await screen.findByRole("button", { name: "Погасить" })).toBeInTheDocument();
    expect(window.__telegram.calls.some((call) => call.name === "web_app_open_popup")).toBe(false);
  });
});

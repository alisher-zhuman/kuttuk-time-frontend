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
    // The SDK refuses a second popup while one is open — without that, only
    // our own guard stands between a double tap and two redeems.
    vi.spyOn(popup, "show").mockImplementation(() => Promise.resolve("redeem") as ReturnType<typeof popup.show>);
    renderWithProviders(<CodeLookup />);

    await userEvent.type(screen.getByPlaceholderText("Введите код сертификата"), CODE);
    // Both taps in one frame — before isPending can disable the button.
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
});

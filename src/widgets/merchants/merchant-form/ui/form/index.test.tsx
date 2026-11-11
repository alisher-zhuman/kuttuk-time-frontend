import { api, fixtures, server } from "@mocks";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { type AdminMerchant } from "@entities/merchant";

import { MerchantForm } from "./index";

const save = () => act(() => window.__telegram.emit("main_button_pressed"));

describe("the owner form - payout details and contact", () => {
  it("creates with the notes; a blank one goes as null", async () => {
    let sent: unknown;
    server.use(
      http.post(api("/admin/merchants"), async ({ request }) => {
        sent = await request.json();
        return HttpResponse.json(fixtures.adminMerchant(), { status: 201 });
      })
    );
    renderWithProviders(<MerchantForm variant={{ kind: "create" }} />);

    await userEvent.type(screen.getByLabelText("Имя или название бизнеса"), "ИП Асанов");
    await userEvent.type(screen.getByLabelText("Telegram ID"), "123456789");
    await userEvent.type(screen.getByLabelText("Реквизиты для выплаты"), "  Mbank 0555 123 456  ");
    save();

    await waitFor(() =>
      expect(sent).toEqual({ name: "ИП Асанов", telegramId: 123456789, payoutDetails: "Mbank 0555 123 456", contact: null })
    );
  });

  it("explains where the Telegram ID comes from", () => {
    renderWithProviders(<MerchantForm variant={{ kind: "create" }} />);

    expect(screen.getByText("Попросите владельца написать боту /id - бот пришлёт число")).toBeInTheDocument();
  });

  it("clearing a note on edit sends null", async () => {
    let sent: unknown;
    server.use(
      http.patch(api("/admin/merchants/10"), async ({ request }) => {
        sent = await request.json();
        return HttpResponse.json(fixtures.adminMerchant({ payoutDetails: null }));
      })
    );
    const merchant = fixtures.adminMerchant() as unknown as AdminMerchant;
    renderWithProviders(<MerchantForm variant={{ kind: "edit", merchant }} />);

    await userEvent.clear(screen.getByLabelText("Реквизиты для выплаты"));
    save();

    await waitFor(() => expect(sent).toMatchObject({ payoutDetails: null, contact: null }));
  });

  it("opened from «Указать реквизиты» - the cursor is in the payout details", () => {
    const merchant = fixtures.adminMerchant({ payoutDetails: null }) as unknown as AdminMerchant;
    renderWithProviders(<MerchantForm variant={{ kind: "edit", merchant }} focusPayoutDetails />);

    expect(screen.getByLabelText("Реквизиты для выплаты")).toHaveFocus();
  });
});

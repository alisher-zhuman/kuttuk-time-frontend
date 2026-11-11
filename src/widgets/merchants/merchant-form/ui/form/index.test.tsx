import { api, fixtures, server } from "@mocks";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { type AdminMerchant } from "@entities/merchant";

import { MerchantForm } from "./index";

const save = () => act(() => window.__telegram.emit("main_button_pressed"));

const mainButton = () => window.__telegram.last("web_app_setup_main_button");

describe("the owner form - payout details and contact", () => {
  it("creates with both notes, trimmed", async () => {
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
    await userEvent.type(screen.getByLabelText("Контакт"), "@asanov");
    save();

    await waitFor(() =>
      expect(sent).toEqual({ name: "ИП Асанов", telegramId: 123456789, payoutDetails: "Mbank 0555 123 456", contact: "@asanov" })
    );
  });

  it("won't create without the contact - «Сохранить» is off", async () => {
    let sent = false;
    server.use(
      http.post(api("/admin/merchants"), () => {
        sent = true;
        return HttpResponse.json(fixtures.adminMerchant(), { status: 201 });
      })
    );
    renderWithProviders(<MerchantForm variant={{ kind: "create" }} />);

    await userEvent.type(screen.getByLabelText("Имя или название бизнеса"), "ИП Асанов");
    await userEvent.type(screen.getByLabelText("Telegram ID"), "123456789");
    await userEvent.type(screen.getByLabelText("Реквизиты для выплаты"), "Mbank 0555 123 456");

    expect(mainButton()?.["is_active"]).toBe(false);
    save();
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(sent).toBe(false);
  });

  it("explains where the Telegram ID comes from", () => {
    renderWithProviders(<MerchantForm variant={{ kind: "create" }} />);

    expect(screen.getByText("Попросите владельца написать боту /id - бот пришлёт число")).toBeInTheDocument();
  });

  it("won't save an edit with the payout details cleared - «Обязательное поле»", async () => {
    let sent = false;
    server.use(
      http.patch(api("/admin/merchants/10"), () => {
        sent = true;
        return HttpResponse.json(fixtures.adminMerchant());
      })
    );
    const merchant = fixtures.adminMerchant() as unknown as AdminMerchant;
    renderWithProviders(<MerchantForm variant={{ kind: "edit", merchant }} />);

    await userEvent.clear(screen.getByLabelText("Реквизиты для выплаты"));

    expect(await screen.findByText("Обязательное поле")).toBeInTheDocument();
    await waitFor(() => expect(mainButton()?.["is_active"]).toBe(false));
    save();
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(sent).toBe(false);
  });
});

import { fixtures, giftHandlers, server } from "@mocks";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { describe, expect, it } from "vitest";

import { ROUTE_PATTERNS } from "@shared/constants";

import { GiftPage } from "./index";

const route = `/app/gifts/${fixtures.GIFT_TOKEN}`;

const open = (options: Parameters<typeof giftHandlers>[0] = {}) => {
  const api = giftHandlers(options);
  server.use(...api.handlers);

  const view = renderWithProviders(<GiftPage />, { route, path: ROUTE_PATTERNS.GIFT });

  return { ...view, calls: api.calls };
};

const mainButton = () => window.__telegram.last("web_app_setup_main_button");

const pressClaim = () => act(() => window.__telegram.emit("main_button_pressed"));

describe("«Забрать подарок»", () => {
  it("shows an available gift with the venue, amount and validity, and «Забрать подарок»", async () => {
    open();

    expect(await screen.findByText("Вам подарок")).toBeInTheDocument();
    expect(screen.getByText("Coffeeroom")).toBeInTheDocument();
    expect(screen.getByText("1 000 сом")).toBeInTheDocument();
    expect(screen.getByText("Действует до 21.10.2027")).toBeInTheDocument();
    expect(mainButton()).toMatchObject({ text: "Забрать подарок", is_visible: true });
  });

  it("asks for bot messages, claims and opens the certificate", async () => {
    const { router, queryClient, calls } = open();

    await screen.findByText("Вам подарок");
    pressClaim();

    await waitFor(() => expect(router.state.location.pathname).toBe("/app/certificates/c7"));
    // The certificate screen says what to do with it now.
    expect(router.state.location.search).toBe("?claimed=1");
    expect(calls.claims).toBe(1);
    expect(window.__telegram.calls.some((call) => call.name === "web_app_request_write_access")).toBe(true);
    // The certificate screen reads this list - the claimed one is already in it.
    expect(queryClient.getQueryData<{ id: string }[]>(["certificates", "my"])?.[0]?.id).toBe("c7");
  });

  it("claims once for a double tap", async () => {
    const { router, calls } = open();

    await screen.findByText("Вам подарок");
    pressClaim();
    pressClaim();

    await waitFor(() => expect(router.state.location.pathname).toBe("/app/certificates/c7"));
    expect(calls.claims).toBe(1);
  });

  it.each([
    ["used", "Этот сертификат уже использован"],
    ["expired", "Срок действия истёк"]
  ] as const)("a %s certificate: says so, nothing to claim", async (status, text) => {
    open({ preview: { state: "available", status } });

    expect(await screen.findByText(text)).toBeInTheDocument();
    expect(mainButton()?.["is_visible"]).not.toBe(true);
    expect(screen.getByRole("button", { name: "В каталог" })).toBeInTheDocument();
  });

  it("the giver's own link: send it to a friend", async () => {
    open({ preview: { state: "own" } });

    expect(await screen.findByText("Это ваш сертификат - отправьте ссылку другу")).toBeInTheDocument();
    expect(mainButton()?.["is_visible"]).not.toBe(true);
  });

  it("already received: a way to «Мои сертификаты»", async () => {
    const { router } = open({ preview: { state: "received" } });

    expect(await screen.findByText("Подарок уже у вас")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Мои сертификаты" }));

    expect(router.state.location.pathname).toBe("/app/profile");
  });

  it("claimed by someone else", async () => {
    open({ preview: { state: "claimed" } });

    expect(await screen.findByText("Этот подарок уже забрали")).toBeInTheDocument();
    expect(mainButton()?.["is_visible"]).not.toBe(true);
  });

  it("an unknown or replaced link (404)", async () => {
    open({ preview: "missing" });

    expect(
      await screen.findByText("Ссылка недействительна - возможно, отправили новую. Попросите прислать ещё раз")
    ).toBeInTheDocument();
  });

  it.each([
    ["already_claimed", { state: "claimed" }, "Этот подарок уже забрали"],
    ["already_used", { state: "available", status: "used" }, "Этот сертификат уже использован"],
    ["expired", { state: "available", status: "expired" }, "Срок действия истёк"],
    ["own", { state: "own" }, "Это ваш сертификат - отправьте ссылку другу"]
  ] as const)("409 %s on claim: looks the link up again and says why", async (claim, afterClaim, text) => {
    const { router } = open({ claim, afterClaim });

    await screen.findByText("Вам подарок");
    pressClaim();

    expect(await screen.findByText(text)).toBeInTheDocument();
    expect(router.state.location.pathname).toBe(route);
  });

  it("404 on claim (a newer card replaced the link): the link is invalid", async () => {
    open({ claim: "missing", afterClaim: "missing" });

    await screen.findByText("Вам подарок");
    pressClaim();

    expect(
      await screen.findByText("Ссылка недействительна - возможно, отправили новую. Попросите прислать ещё раз")
    ).toBeInTheDocument();
  });

  it("names the giver when Telegram gave a name", async () => {
    open({ preview: { state: "available", from: "Айбек" } });

    expect(await screen.findByText("Айбек дарит вам подарок")).toBeInTheDocument();
  });

  it("shows where to use it - the address and «Открыть на карте»", async () => {
    open();

    expect(await screen.findByText("ул. Киевская 95, 2 этаж")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Открыть на карте" }));
    expect(window.__telegram.last("web_app_open_link")?.["url"]).toBe("https://2gis.kg/bishkek/firm/70000001234567");
  });
});

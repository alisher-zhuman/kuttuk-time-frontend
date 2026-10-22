import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { describe, expect, it } from "vitest";

import { VenueShareLink } from "./index";

const LINK = "https://t.me/kuttuk_time_bot/app?startapp=coffeeroom";

describe("venue share link", () => {
  it("shows the link and copies it whole, with haptic and «Скопировано»", async () => {
    const user = userEvent.setup();
    renderWithProviders(<VenueShareLink slug="coffeeroom" venueName="Coffeeroom" />);

    expect(screen.getByText("t.me/kuttuk_time_bot/app?startapp=coffeeroom")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Скопировать" }));

    expect(await navigator.clipboard.readText()).toBe(LINK);
    expect(await screen.findByRole("button", { name: "Скопировано" })).toBeInTheDocument();
    expect(window.__telegram.last("web_app_trigger_haptic_feedback")).toBeDefined();
  });

  it("shares the link through Telegram with the venue's name", async () => {
    renderWithProviders(<VenueShareLink slug="coffeeroom" venueName="Coffeeroom" />);

    await userEvent.click(screen.getByRole("button", { name: "Поделиться" }));

    const shared = String(window.__telegram.last("web_app_open_tg_link")?.["path_full"]);
    expect(decodeURIComponent(shared)).toContain(LINK);
    expect(decodeURIComponent(shared)).toContain("Подарочные сертификаты Coffeeroom");
  });

  it("opens the QR full screen; no PNG download on a phone", async () => {
    renderWithProviders(<VenueShareLink slug="coffeeroom" venueName="Coffeeroom" />);

    expect(screen.queryByRole("button", { name: "Скачать QR" })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Открыть QR на весь экран" }));

    expect(screen.getByRole("dialog", { name: "QR-код ссылки Coffeeroom" })).toBeInTheDocument();
    expect(screen.getByText("Сделайте скриншот, чтобы распечатать")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Закрыть" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

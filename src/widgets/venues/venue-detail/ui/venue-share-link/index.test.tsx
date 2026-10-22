import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { describe, expect, it } from "vitest";

import { VenueShareLink } from "./index";

const LINK = "https://t.me/kuttuk_time_bot/app?startapp=coffeeroom";

const openSheet = async (user = userEvent.setup()) => {
  renderWithProviders(<VenueShareLink slug="coffeeroom" venueName="Coffeeroom" />);

  // On the venue — only the row; the link and the QR live in the sheet.
  expect(screen.queryByText("t.me/kuttuk_time_bot/app?startapp=coffeeroom")).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Ссылка для соцсетей" }));

  return user;
};

describe("venue share link", () => {
  it("copies the link whole from the sheet, with haptic and «Скопировано»", async () => {
    const user = await openSheet();

    expect(screen.getByRole("dialog", { name: "Ссылка для соцсетей" })).toBeInTheDocument();
    expect(screen.getByText("t.me/kuttuk_time_bot/app?startapp=coffeeroom")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Скопировать" }));

    expect(await navigator.clipboard.readText()).toBe(LINK);
    expect(await screen.findByRole("button", { name: "Скопировано" })).toBeInTheDocument();
    expect(window.__telegram.last("web_app_trigger_haptic_feedback")).toBeDefined();
  });

  it("shares the link through Telegram with the venue's name", async () => {
    const user = await openSheet();

    await user.click(screen.getByRole("button", { name: "Поделиться" }));

    const shared = decodeURIComponent(String(window.__telegram.last("web_app_open_tg_link")?.["path_full"]));
    expect(shared).toContain(LINK);
    expect(shared).toContain("Подарочные сертификаты Coffeeroom");
  });

  it("shows the QR; on a phone a screenshot hint instead of a PNG download", async () => {
    await openSheet();

    expect(screen.getByRole("img", { name: "QR-код ссылки Coffeeroom" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Скачать QR" })).not.toBeInTheDocument();
    expect(screen.getByText("Для печати — сделайте скриншот QR")).toBeInTheDocument();
  });
});

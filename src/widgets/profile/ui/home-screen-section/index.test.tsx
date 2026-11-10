import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { checkHomeScreenStatus } from "@tma.js/sdk-react";
import { describe, expect, it, vi } from "vitest";

import { HomeScreenSection } from "./index";

const ADD = { name: "Добавить" };

const called = (method: string) => window.__telegram.calls.some((call) => call.name === method);

// Telegram answers on the next tick - let that answer land.
const telegramAnswered = () => new Promise((resolve) => setTimeout(resolve, 10));

describe("home screen icon for the owner", () => {
  it("offers the button when there is no icon yet, and says so once added", async () => {
    window.__telegram.replies.homeScreen = "missed";
    renderWithProviders(<HomeScreenSection />);

    await userEvent.click(await screen.findByRole("button", ADD));

    expect(called("web_app_add_to_home_screen")).toBe(true);
    expect(await screen.findByText("Иконка на главном экране")).toBeInTheDocument();
    expect(screen.queryByRole("button", ADD)).not.toBeInTheDocument();
  });

  it("offers it when Telegram can't tell whether the icon is there", async () => {
    window.__telegram.replies.homeScreen = "unknown";
    renderWithProviders(<HomeScreenSection />);

    expect(await screen.findByRole("button", ADD)).toBeInTheDocument();
  });

  it("keeps the button when the owner declines", async () => {
    window.__telegram.replies.homeScreen = "missed";
    window.__telegram.replies.addToHomeScreen = "failed";
    renderWithProviders(<HomeScreenSection />);

    await userEvent.click(await screen.findByRole("button", ADD));

    await telegramAnswered();
    expect(called("web_app_add_to_home_screen")).toBe(true);
    expect(screen.getByRole("button", ADD)).toBeInTheDocument();
  });

  it("no button when the icon is already added - just the note", async () => {
    window.__telegram.replies.homeScreen = "added";
    renderWithProviders(<HomeScreenSection />);

    expect(await screen.findByText("Иконка на главном экране")).toBeInTheDocument();
    expect(screen.queryByRole("button", ADD)).not.toBeInTheDocument();
  });

  it("nothing at all where Telegram can't add an icon", async () => {
    window.__telegram.replies.homeScreen = "unsupported";
    const { container } = renderWithProviders(<HomeScreenSection />);

    await waitFor(() => expect(called("web_app_check_home_screen")).toBe(true));
    await telegramAnswered();
    expect(container).toBeEmptyDOMElement();
  });

  it("nothing on clients without Mini Apps 8.0 - not even the check", () => {
    vi.spyOn(checkHomeScreenStatus, "isAvailable").mockReturnValue(false);
    const { container } = renderWithProviders(<HomeScreenSection />);

    expect(container).toBeEmptyDOMElement();
    expect(called("web_app_check_home_screen")).toBe(false);
  });
});

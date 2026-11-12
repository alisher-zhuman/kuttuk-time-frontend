import { api, server } from "@mocks";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests";
import { http, HttpResponse } from "msw/http";
import { describe, expect, it, vi } from "vitest";

import { useAppModeStore, useAuthStore } from "@shared/store";

import { TelegramSignOut } from "./index";

const signedIn = () => {
  useAppModeStore.setState({ mode: "web" });
  useAuthStore.setState({ accessToken: "tg-jwt", role: "user", isGuest: false });
  localStorage.setItem("kuttuk-time-telegram-session", JSON.stringify({ accessToken: "tg-jwt", role: "user", user: { id: 777, fullName: "Айбек", username: null, photoUrl: null } }));
};

describe("«Выйти» on the website", () => {
  it("after a confirm: the Telegram session goes, a quiet guest again", async () => {
    const sent: unknown[] = [];
    server.use(
      http.post(api("/auth/guest"), async ({ request }) => {
        sent.push(await request.json());
        return HttpResponse.json({ accessToken: "guest-jwt", role: "user", guestToken: "g-2" });
      })
    );
    vi.spyOn(window, "confirm").mockReturnValue(true);
    signedIn();
    renderWithProviders(<TelegramSignOut />);

    await userEvent.click(screen.getByRole("button", { name: "Выйти" }));

    await waitFor(() => expect(useAuthStore.getState()).toMatchObject({ accessToken: "guest-jwt", isGuest: true }));
    expect(sent).toEqual([{}]);
    expect(localStorage.getItem("kuttuk-time-telegram-session")).toBeNull();
    expect(screen.queryByRole("button", { name: "Выйти" })).not.toBeInTheDocument();
  });

  it("cancelled - nothing changes", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    signedIn();
    renderWithProviders(<TelegramSignOut />);

    await userEvent.click(screen.getByRole("button", { name: "Выйти" }));

    expect(useAuthStore.getState().accessToken).toBe("tg-jwt");
    expect(localStorage.getItem("kuttuk-time-telegram-session")).not.toBeNull();
  });

  it("nothing for a guest or in the Mini App", () => {
    useAppModeStore.setState({ mode: "web" });
    useAuthStore.setState({ isGuest: true });
    const guest = renderWithProviders(<TelegramSignOut />);
    expect(guest.container).toBeEmptyDOMElement();

    useAppModeStore.setState({ mode: "telegram" });
    useAuthStore.setState({ isGuest: false });
    const miniApp = renderWithProviders(<TelegramSignOut />);
    expect(miniApp.container).toBeEmptyDOMElement();
  });
});

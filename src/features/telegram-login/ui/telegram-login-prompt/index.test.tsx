import { api, server } from "@mocks";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fakeIdToken, installTelegramLogin, renderWithProviders } from "@tests";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";

import { useAppModeStore, useAuthStore } from "@shared/store";

import { TelegramLoginPrompt } from "./index";

const HINT = "Войдите через Telegram, чтобы не потерять сертификаты и получать напоминания о сроке";

const asGuest = () => {
  useAppModeStore.setState({ mode: "web" });
  useAuthStore.setState({ accessToken: "guest-jwt", role: "user", isGuest: true });
};

describe("«Войти через Telegram» on the website (Log In With Telegram)", () => {
  it("asks Telegram for the profile and the bot's messages - never the phone - in the app's language", async () => {
    const login = installTelegramLogin();
    asGuest();
    renderWithProviders(<TelegramLoginPrompt />, { language: "kg" });

    await userEvent.click(screen.getByRole("button", { name: "Telegram аркылуу кирүү" }));

    expect(login.state.options).toEqual([{ client_id: 8215578063, scope: ["profile", "write"], lang: "ky" }]);
  });

  it("the id_token merges the guest into the Telegram account - the new JWT at once, the prompt goes", async () => {
    let body: unknown;
    server.use(
      http.post(api("/auth/telegram-oidc"), async ({ request }) => {
        body = await request.json();
        return HttpResponse.json({ accessToken: "tg-jwt", role: "user", merged: true });
      })
    );
    const login = installTelegramLogin();
    localStorage.setItem("kuttuk-time-guest-token", "g-1");
    asGuest();
    renderWithProviders(<TelegramLoginPrompt />);

    expect(screen.getByText(HINT)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Войти через Telegram" }));
    login.signIn({ id: 777, name: "Айбек" });

    await waitFor(() => expect(useAuthStore.getState().accessToken).toBe("tg-jwt"));
    expect(body).toEqual({ idToken: fakeIdToken({ id: 777, name: "Айбек" }), guestToken: "g-1" });
    expect(useAuthStore.getState().isGuest).toBe(false);
    expect(localStorage.getItem("kuttuk-time-guest-token")).toBeNull();
    expect(screen.queryByText(HINT)).not.toBeInTheDocument();
  });

  it.each([401, 400])("the backend refuses Telegram's token (%i) - «Не удалось войти, попробуйте ещё раз», still a guest", async (status) => {
    server.use(http.post(api("/auth/telegram-oidc"), () => HttpResponse.json({ message: "Invalid Telegram login" }, { status })));
    const alert = vi.spyOn(window, "alert").mockImplementation(() => undefined);
    const login = installTelegramLogin();
    asGuest();
    renderWithProviders(<TelegramLoginPrompt />);

    await userEvent.click(screen.getByRole("button", { name: "Войти через Telegram" }));
    login.signIn();

    await waitFor(() => expect(alert).toHaveBeenCalledWith("Не удалось войти, попробуйте ещё раз"));
    expect(useAuthStore.getState()).toMatchObject({ accessToken: "guest-jwt", isGuest: true });
  });

  it("Telegram's own error - the same message; a closed popup - nothing", async () => {
    const alert = vi.spyOn(window, "alert").mockImplementation(() => undefined);
    const login = installTelegramLogin();
    asGuest();
    renderWithProviders(<TelegramLoginPrompt />);

    await userEvent.click(screen.getByRole("button", { name: "Войти через Telegram" }));
    login.answer({ error: "popup_closed" });
    expect(alert).not.toHaveBeenCalled();

    login.answer({ error: "access_denied" });
    expect(alert).toHaveBeenCalledWith("Не удалось войти, попробуйте ещё раз");
  });

  it("loads Telegram's login library (oauth.telegram.org), not the old widget; the button waits for it", () => {
    asGuest();
    renderWithProviders(<TelegramLoginPrompt />);

    const script = document.head.querySelector<HTMLScriptElement>('script[src*="telegram"]');
    expect(script?.src).toBe("https://oauth.telegram.org/js/telegram-login.js?6");
    expect(screen.getByRole("button", { name: "Войти через Telegram" })).toBeDisabled();
  });

  it("nothing for a signed-in buyer or in the Mini App", () => {
    useAppModeStore.setState({ mode: "web" });
    useAuthStore.setState({ isGuest: false });
    const { container } = renderWithProviders(<TelegramLoginPrompt />);

    expect(container).toBeEmptyDOMElement();

    useAppModeStore.setState({ mode: "telegram" });
    useAuthStore.setState({ isGuest: true });
    const other = renderWithProviders(<TelegramLoginPrompt />);
    expect(other.container).toBeEmptyDOMElement();
  });
});

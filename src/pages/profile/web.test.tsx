import { api, server } from "@mocks";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { ROUTE_PATTERNS } from "@shared/constants";
import { useAppModeStore, useAuthStore } from "@shared/store";

import { ProfilePage } from "./index";

describe("the website's profile", () => {
  it("signed in with Telegram: the name from the widget", async () => {
    server.use(http.get(api("/certificates/my"), () => HttpResponse.json([])));
    useAppModeStore.setState({ mode: "web" });
    useAuthStore.setState({ accessToken: "tg-jwt", role: "user", isGuest: false });
    localStorage.setItem(
      "kuttuk-time-telegram-auth",
      JSON.stringify({ id: 777, first_name: "Айбек", last_name: "Асанов", username: "aibek", hash: "abc" })
    );
    renderWithProviders(<ProfilePage />, { route: ROUTE_PATTERNS.PROFILE, path: ROUTE_PATTERNS.PROFILE });

    expect(screen.getByText("Айбек Асанов")).toBeInTheDocument();
    expect(screen.getByText("@aibek")).toBeInTheDocument();
    expect(await screen.findByText("Пока нет сертификатов")).toBeInTheDocument();
  });

  it("a guest: the invitation to sign in above «Мои сертификаты»", async () => {
    server.use(http.get(api("/certificates/my"), () => HttpResponse.json([])));
    useAppModeStore.setState({ mode: "web" });
    useAuthStore.setState({ accessToken: "guest-jwt", role: "user", isGuest: true });
    renderWithProviders(<ProfilePage />, { route: ROUTE_PATTERNS.PROFILE, path: ROUTE_PATTERNS.PROFILE });

    expect(
      await screen.findByText("Войдите через Telegram, чтобы не потерять сертификаты и получать напоминания о сроке")
    ).toBeInTheDocument();
  });
});

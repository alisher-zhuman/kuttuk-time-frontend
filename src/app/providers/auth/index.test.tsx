import { api, server } from "@mocks";
import { render, screen } from "@testing-library/react";
import { delay, http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

import { useAuthStore } from "@shared/store";

import "@tests";

import { AuthProvider } from "./index";

const WAKING = "Запускаем сервер, это может занять до 30 секунд";

describe("log-in at start", () => {
  it("a slow log-in (the backend waking up) says why it takes so long", async () => {
    useAuthStore.setState({ isReady: false, isSessionExpired: false });
    server.use(
      http.post(api("/auth/log-in"), async () => {
        await delay(3500);
        return HttpResponse.json({ accessToken: "t", role: "user" }, { status: 201 });
      })
    );
    render(<AuthProvider>app</AuthProvider>);

    expect(screen.queryByText(WAKING)).not.toBeInTheDocument();
    expect(await screen.findByText(WAKING, undefined, { timeout: 4000 })).toBeInTheDocument();
    expect(await screen.findByText("app", undefined, { timeout: 2000 })).toBeInTheDocument();
  }, 10_000);

  it("a failed log-in offers «Повторить»", async () => {
    useAuthStore.setState({ isReady: false, isSessionExpired: false });
    server.use(http.post(api("/auth/log-in"), () => HttpResponse.json({}, { status: 503 })));
    render(<AuthProvider>app</AuthProvider>);

    expect(await screen.findByRole("button", { name: "Повторить" })).toBeInTheDocument();
  });
});

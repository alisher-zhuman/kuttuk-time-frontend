import { api, server } from "@mocks";
import { render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw/http";
import { delay } from "msw/utils/delay";
import { describe, expect, it } from "vitest";

import { useAppModeStore, useAuthStore } from "@shared/store";

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

  it("the website: the pre-rendered page stays while the app signs in, then the app takes over", async () => {
    useAuthStore.setState({ isReady: false, isSessionExpired: false });
    useAppModeStore.setState({ mode: "web" });
    const page = document.createElement("div");
    page.id = "seo";
    page.textContent = "Sierra Coffee";
    document.body.append(page);
    server.use(
      http.post(api("/auth/guest"), async () => {
        await delay(300);
        return HttpResponse.json({ accessToken: "g", role: "user", guestToken: "g-1" });
      })
    );
    const { container } = render(<AuthProvider>app</AuthProvider>);

    // No spinner over the page the reader already sees.
    expect(container).toBeEmptyDOMElement();
    expect(document.getElementById("seo")).toBeInTheDocument();

    expect(await screen.findByText("app")).toBeInTheDocument();
    await waitFor(() => expect(document.getElementById("seo")).not.toBeInTheDocument());
  });
});

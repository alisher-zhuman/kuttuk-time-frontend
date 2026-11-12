import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";

import { useAppModeStore, useAuthStore, useWebMainButtonStore } from "@shared/store";

import "@testing-library/jest-dom/vitest";

import { server } from "./mocks/server";
import { installTelegram } from "./test-utils/telegram";
import { removeTelegramLogin } from "./test-utils/telegram-login";

// Telegram first: the SDK reads the launch params and the bridge as soon as
// the app's modules load (TMAProvider calls init() at import).
installTelegram();

// jsdom has no layout, so none of these exist; with no sizes or scrolling
// there is nothing for them to do.
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

globalThis.ResizeObserver = NoopObserver;
globalThis.IntersectionObserver = NoopObserver as unknown as typeof IntersectionObserver;
Element.prototype.scrollIntoView = () => {};
// jsdom has no matchMedia.
if (typeof window.matchMedia !== "function") {
  window.matchMedia = ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false
  }));
}

beforeAll(() => {
  server.listen({ onUnhandledFrame: "error" });
});

// "error" alone only refuses the request - the screen shows its error state
// and a test asserting something else still passes. So every unanswered
// request fails the test that made it, by name.
const unanswered: string[] = [];

server.events.on("request:unhandled", ({ request }) => {
  unanswered.push(`${request.method} ${new URL(request.url).pathname}`);
});

afterEach(() => {
  // Testing Library auto-cleans only with injected globals, which we don't use.
  cleanup();
  server.resetHandlers();
  window.__telegram.reset();
  removeTelegramLogin();
  // Back to the Mini App between tests; the website's tests switch it on.
  useAppModeStore.setState({ mode: "telegram" });
  useWebMainButtonStore.setState({ button: null });
  useAuthStore.setState({ isGuest: false });
  localStorage.clear();

  const missed = unanswered.splice(0);

  if (missed.length > 0) {
    throw new Error(`Requests nothing answered:\n${missed.join("\n")}`);
  }
});

afterAll(() => {
  server.close();
});

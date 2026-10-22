import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";

import "@testing-library/jest-dom/vitest";

import { server } from "./mocks/server";
import { installTelegram } from "./test-utils/telegram";

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
window.matchMedia ??= ((query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false
})) as typeof window.matchMedia;

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

// "error" alone only refuses the request — the screen shows its error state
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

  const missed = unanswered.splice(0);

  if (missed.length > 0) {
    throw new Error(`Requests nothing answered:\n${missed.join("\n")}`);
  }
});

afterAll(() => {
  server.close();
});

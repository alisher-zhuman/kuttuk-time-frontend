import { describe, expect, it, vi } from "vitest";

// Each case loads the provider afresh: the mode is decided once, at import -
// the SDK's init() works only with Telegram's launch params.
const loadMode = async () => {
  vi.resetModules();
  await import("./index");
  const { useAppModeStore } = await import("@shared/store");

  return useAppModeStore.getState().mode;
};

describe("Telegram or the website", () => {
  it("opened inside Telegram (launch params) - the Mini App", async () => {
    expect(await loadMode()).toBe("telegram");
  });

  it("a plain browser (no launch params) - the website", async () => {
    window.history.replaceState(null, "", "/app");
    sessionStorage.clear();
    delete window.TelegramWebviewProxy;

    expect(await loadMode()).toBe("web");
  });
});

import { type Page, test as base } from "@playwright/test";

export { expect } from "@playwright/test";

export const API = "http://api.test/api";

type Route = (request: { path: string; method: string; query: URLSearchParams; body: unknown }) =>
  | [number, unknown]
  | undefined;

// Launch params as Telegram passes them (in the URL hash).
const launchParams = () =>
  new URLSearchParams({
    tgWebAppData: new URLSearchParams({
      auth_date: String(Math.floor(Date.now() / 1000)),
      signature: "x",
      user: JSON.stringify({ id: 1, first_name: "Test", language_code: "ru" }),
      hash: "0"
    }).toString(),
    tgWebAppVersion: "8.0",
    tgWebAppPlatform: "android",
    tgWebAppThemeParams: JSON.stringify({ bg_color: "#ffffff" })
  }).toString();

// The Telegram bridge: records calls, answers the ones that wait for a reply.
// What the "user" picks in native dialogs comes from window.__replies.
const installTelegram = () => {
  const w = window as unknown as Record<string, unknown> & {
    Telegram?: { WebView?: { receiveEvent: (t: string, d?: unknown) => void } };
  };
  const calls: { name: string; params: unknown }[] = [];
  const replies: Record<string, string> = {};
  const reply = (type: string, data?: unknown) =>
    setTimeout(() => w.Telegram?.WebView?.receiveEvent(type, data), 0);

  w["__calls"] = calls;
  w["__replies"] = replies;
  w["TelegramWebviewProxy"] = {
    postEvent: (name: string, data?: string) => {
      calls.push({ name, params: data ? JSON.parse(data) : undefined });

      if (name === "web_app_request_viewport") reply("viewport_changed", { height: 800, width: 400, is_expanded: true, is_state_stable: true });
      if (name === "web_app_request_safe_area") reply("safe_area_changed", { top: 0, bottom: 0, left: 0, right: 0 });
      if (name === "web_app_request_content_safe_area") reply("content_safe_area_changed", { top: 0, bottom: 0, left: 0, right: 0 });
      if (name === "web_app_open_popup") reply("popup_closed", replies["popup"] ? { button_id: replies["popup"] } : {});
      if (name === "web_app_request_write_access") reply("write_access_requested", { status: "allowed" });
      if (name === "web_app_send_prepared_message") reply("prepared_message_sent");
    }
  };
};

export class MiniApp {
  readonly sent: { method: string; path: string; body: unknown }[] = [];
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // role: what log-in answers; routes: the rest of the API for this test.
  async open(path: string, { role = "user", routes }: { role?: string; routes: Route }) {
    await this.page.addInitScript(installTelegram);
    await this.page.route(`${API}/**`, async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      const path = url.pathname.replace(/^\/api/, "");
      let body: unknown;

      try {
        body = request.postDataJSON();
      } catch {
        body = undefined;
      }

      if (request.method() !== "GET") this.sent.push({ method: request.method(), path, body });

      const answer =
        path === "/auth/log-in"
          ? ([201, { accessToken: "t", role }] as [number, unknown])
          : routes({ path, method: request.method(), query: url.searchParams, body });

      // An unmocked request fails the test by name, as in the unit suite.
      if (!answer) throw new Error(`Nothing answered ${request.method()} ${path}`);

      await route.fulfill({ status: answer[0], contentType: "application/json", body: JSON.stringify(answer[1]) });
    });
    await this.page.goto(`${path}#${launchParams()}`);
  }

  // The native MainButton: Telegram draws it, so tests read its params and
  // press it through the bridge.
  async mainButton() {
    return this.page.evaluate(
      () =>
        (window as unknown as { __calls: { name: string; params: { text?: string; is_visible?: boolean } }[] }).__calls
          .filter((c) => c.name === "web_app_setup_main_button")
          .at(-1)?.params
    );
  }

  pressMainButton() {
    return this.page.evaluate(() =>
      (window as unknown as { Telegram: { WebView: { receiveEvent: (t: string, d: unknown) => void } } }).Telegram.WebView.receiveEvent("main_button_pressed", {})
    );
  }

  answerPopupWith(buttonId: string) {
    return this.page.evaluate((id) => {
      (window as unknown as { __replies: Record<string, string> }).__replies["popup"] = id;
    }, buttonId);
  }

  calls(name: string) {
    return this.page.evaluate(
      (n) => (window as unknown as { __calls: { name: string; params: unknown }[] }).__calls.filter((c) => c.name === n).map((c) => c.params),
      name
    );
  }
}

export const test = base.extend<{ app: MiniApp }>({
  // Playwright's fixture callback; named so lint doesn't take it for React's use().
  app: async ({ page }, provide) => {
    await provide(new MiniApp(page));
  }
});

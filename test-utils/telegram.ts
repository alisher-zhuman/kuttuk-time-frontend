// A fake Telegram client for jsdom: launch params in the URL and a bridge
// (TelegramWebviewProxy) that records every method the app calls and answers
// the ones that wait for a reply. The same fake the browser checks used.

interface Calls {
  name: string;
  params: Record<string, unknown> | undefined;
}

// What the "user" answers in the native dialogs, set per test.
interface Replies {
  popup?: string;
  qr?: string;
  writeAccess?: "allowed" | "cancelled";
  share?: "sent" | "failed";
}

declare global {
  interface Window {
    __telegram: {
      calls: Calls[];
      replies: Replies;
      // The params of the last call of this method.
      last: (name: string) => Record<string, unknown> | undefined;
      // An event from Telegram to the app (e.g. main_button_pressed).
      emit: (type: string, data?: unknown) => void;
      reset: () => void;
    };
    TelegramWebviewProxy?: { postEvent: (name: string, data?: string) => void };
    Telegram?: { WebView?: { receiveEvent: (type: string, data?: unknown) => void } };
  }
}

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

export const installTelegram = () => {
  window.history.replaceState(null, "", `/#${launchParams()}`);

  const emit = (type: string, data?: unknown) =>
    window.Telegram?.WebView?.receiveEvent(type, data);

  // Async, like the real client: the SDK subscribes after posting.
  const reply = (type: string, data?: unknown) => setTimeout(() => emit(type, data), 0);

  window.__telegram = {
    calls: [],
    replies: {},
    last: (name) => window.__telegram.calls.filter((c) => c.name === name).at(-1)?.params,
    emit,
    reset: () => {
      window.__telegram.calls = [];
      window.__telegram.replies = {};
    }
  };

  window.TelegramWebviewProxy = {
    postEvent: (name, data) => {
      const params = data ? (JSON.parse(data) as Record<string, unknown>) : undefined;
      const { replies } = window.__telegram;

      window.__telegram.calls.push({ name, params });

      switch (name) {
        case "web_app_request_viewport":
          return reply("viewport_changed", { height: 800, width: 400, is_expanded: true, is_state_stable: true });
        case "web_app_request_safe_area":
          return reply("safe_area_changed", { top: 0, bottom: 0, left: 0, right: 0 });
        case "web_app_request_content_safe_area":
          return reply("content_safe_area_changed", { top: 0, bottom: 0, left: 0, right: 0 });
        case "web_app_open_popup":
          return reply("popup_closed", replies.popup ? { button_id: replies.popup } : {});
        case "web_app_request_write_access":
          return reply("write_access_requested", { status: replies.writeAccess ?? "allowed" });
        case "web_app_open_scan_qr_popup":
          return replies.qr === undefined ? undefined : reply("qr_text_received", { data: replies.qr });
        case "web_app_send_prepared_message":
          return replies.share === "failed"
            ? reply("prepared_message_failed", { error: "USER_DECLINED" })
            : reply("prepared_message_sent");
      }
    }
  };
};

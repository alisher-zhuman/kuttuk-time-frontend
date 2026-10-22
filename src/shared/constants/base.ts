export const BOT_URL = "https://t.me/kuttuk_time_bot";
export const SUPPORT_URL = "https://t.me/alisher_zh";

// startapp=order_<uuid> — where Finik sends the buyer back after paying.
// Merchant slugs are /^[a-z0-9-]+$/ in ../backend (no underscore), so this
// prefix can't collide with a merchant handle.
export const ORDER_START_PARAM_PREFIX = "order_";

// The venue's own link for social bios, stories and a printed QR: opens the
// Mini App on its page (RootRedirect reads a startapp without the order prefix
// as a venue handle). Not the short kuttuk-time.koyeb.app/<slug> — someone
// else's domain, and the backend sleeps when idle.
export const getVenueShareLink = (slug: string) =>
  `${BOT_URL}/app?startapp=${encodeURIComponent(slug)}`;

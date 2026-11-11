export const BOT_USERNAME = "kuttuk_time_bot";
export const BOT_URL = `https://t.me/${BOT_USERNAME}`;
export const SUPPORT_URL = "https://t.me/alisher_zh";

// startapp=order_<uuid> - where Finik sends the buyer back after paying.
// Merchant slugs are /^[a-z0-9-]+$/ in ../backend (no underscore), so this
// prefix can't collide with a merchant handle.
export const ORDER_START_PARAM_PREFIX = "order_";

// startapp=gift_<token> - «Забрать подарок» on the bot's gift card. Shared with
// ../backend src/certificates/gift-token.ts - change both together. The token
// is 22 base64url chars; no slug has an underscore, so it can't collide.
export const GIFT_START_PARAM_PREFIX = "gift_";

// startapp=my_certificates - «Мои сертификаты» (the bot's expiry reminder for a
// claimed gift). Shared with ../backend src/orders/payment-redirect-url.ts.
export const MY_CERTIFICATES_START_PARAM = "my_certificates";

// startapp=admin_payouts - the Monday payout reminder's button: «Выплаты» →
// «Все долги» for an admin, the usual start for anyone else. Shared with
// ../backend src/orders/payment-redirect-url.ts (ADMIN_PAYOUTS_START_PARAM).
export const ADMIN_PAYOUTS_START_PARAM = "admin_payouts";

// The website's own addresses, built by the backend (../backend
// src/orders/payment-redirect-url.ts - change both together): Finik returns a
// website buyer to <site>/orders/<id>, a website gift link is <site>/gift/<token>.
export const WEB_ORDER_PATH = "/orders/";
export const WEB_GIFT_PATH = "/gift/";

// The venue's own link for social bios, stories and a printed QR: opens the
// Mini App on its page (RootRedirect reads a startapp without the order prefix
// as a venue handle). Not the short kuttuk-time.koyeb.app/<slug> - someone
// else's domain, and the backend sleeps when idle.
export const getVenueShareLink = (slug: string) =>
  `${BOT_URL}/app?startapp=${encodeURIComponent(slug)}`;

export const BOT_URL = "https://t.me/kuttuk_time_bot";
export const SUPPORT_URL = "https://t.me/grozbytas";

// startapp=order_<uuid> — where Finik sends the buyer back after paying.
// Merchant slugs are /^[a-z0-9-]+$/ in ../backend (no underscore), so this
// prefix can't collide with a merchant handle.
export const ORDER_START_PARAM_PREFIX = "order_";

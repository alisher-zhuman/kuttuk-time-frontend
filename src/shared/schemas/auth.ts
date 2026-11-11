import { z } from "zod";

import { UserRoleSchema } from "./user-role";

export const LogInPayloadSchema = z.object({
  initData: z.string().min(1)
});

export const LogInResponseSchema = z.object({
  accessToken: z.string().min(1),
  role: UserRoleSchema
});

// POST /auth/guest - the website's guest: the same guest while the browser
// keeps guestToken (../backend docs/web-version.md).
export const GuestLogInResponseSchema = LogInResponseSchema.extend({
  guestToken: z.string().min(1)
});

// POST /auth/telegram-widget - «Войти через Telegram» on the website; merged:
// the guest's purchases moved to the Telegram account.
export const WidgetLogInResponseSchema = LogInResponseSchema.extend({
  merged: z.boolean()
});

# kuttuk-time-frontend

Telegram Mini App for buying gift certificates.

## Business model

**KuttukTime** — a gift certificate platform for local businesses (coffee shops, restaurants, spas, fitness studios) in Kyrgyzstan.

**Purchase flow (buyer):**
1. Opened the TMA → picked a venue → picked an amount → paid → got a code
2. Time: 30 seconds. No registration, no phone number required.
3. The code can be shared in Telegram.

**Merchant flow:**
- Onboarding: gets a special link, opens it once → the system remembers them
- Dashboard: weekly stats, list of active codes, "Mark as used" button
- Payouts: automatic every Monday (Finik / Bakai / Freedom)

**Monetization:** 10% commission per sale.
- Example: buyer pays 1000 som → payment provider −20 som → merchant gets 900 som → KuttukTime earns 80 som

**Current status:** MVP, 2 merchants ready for testing.

**Metrics:**
- Concern threshold: < 10 orders/week
- Success threshold: > 50 orders/week after a month

**Roadmap:**
- Month 1–2: 2 merchants, 20–50 orders/week, validate the model
- Month 3–4: 5–10 merchants, 100+ orders/week
- Month 6+: 20–50 merchants, 500+ orders/week, personal merchant links
- Year+: 100+ merchants, expansion to other cities in Kyrgyzstan

## Product decisions

Source of truth: `../backend/CLAUDE.md`, section **Product decisions** — don't duplicate it here. The ones that shape the frontend:
- Roles are only `user` / `merchant` / `admin` — no staff/cashier role; the merchant (owner) redeems certificates
- **merchant ≠ venue.** `merchant` = the owner's business account (role, cabinet, payouts, `isActive`, `telegramId`); `venue` = a storefront the buyer sees and buys from. One merchant owns one or more venues. `venue` is data, not a role
- A certificate is redeemed in full — no partial redemption

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **TanStack Query** — server state
- **Zustand** — client state
- **React Router v7** — routing
- **@tma.js/sdk-react** — Telegram Mini Apps SDK
- **react-i18next** — i18n (locales: `ru`, `kg`, `en`)
- **Zod** — API response validation
- **pnpm** — package manager

## Architecture — FSD

Layers (imports only go downward through this list):

```
app → pages → widgets → features → entities → shared
```

Path aliases: `@app`, `@pages`, `@widgets`, `@features`, `@entities`, `@shared`

**Where code goes — ask in this order:**
1. **No business word in it** (formatting, SDK wrappers, UI kit, routes, locales) → `shared`, split by segment, no modules
2. **One entity's data or plain display of it** (schema, API, query hooks, card) → `entities/<entity>`, by domain, not by screen or role: `venue` (storefront), `merchant` (owner account), `category`, `order`, `certificate`, `payout` (admin weekly report) — same names as the backend API. Cross-entity imports only via `@x` (`entities/venue/@x/merchant.ts` → `MerchantMe.venues`)
3. **An action reused by two or more widgets** → `features/<action>`. With a single consumer the action lives in its widget — a create/edit form is one widget, not a feature. Today: `category-filter` (buyer home + admin venue list), `venue-filter` (owner's summary + certificate list; hidden for a single venue)
4. **A block of one page** → `widgets`, grouped by module
5. **The rest** (route params, gating on queries, picking a widget) → `pages`. A page is the route and nothing else: `index.ts` + one component, no `hooks/` / `helpers/` / `model/`, queries inline

**Modules — by what the person is doing, never by role** (same rule as in `kca-frontend-private`):
- buyer flow, flat: `home`, `venue` (`/app/venues/:handle`), `order`, `certificate`, `profile`
- `venues/` — managing venues: list / create / detail / edit (admin, any venue), own-edit (owner, own venue). Widgets `venue-list`, `venue-detail`, `venue-form`
- `merchants/` — merchant accounts: list / create / detail / edit (admin), cabinet / summary / certificates (owner; redeeming lives on the certificates tab). Widgets `merchant-list`, `merchant-detail`, `merchant-form`, `week-summary`, `certificate-list`
- `categories/` — list / create / edit; widgets `category-list`, `category-form`
- `orders/` — admin orders: list / detail (the buyer's own order screen stays flat `order`). `payouts` (`/app/admin/payouts`, weekly payout report) — flat until it grows. «Выплаты», not «Платежи»: the tab is the weekly payout to merchants, not incoming payments
- **Roles change permissions, fields and endpoints — not folders.** One screen serves every role that uses it: `venue-form` takes `variant: create | edit | own` (admin: slug, owner, status, `/admin/venues`; owner: storefront fields only, `PATCH /merchants/me/venues/:venueId`); the cabinet home shows the same `VenueDetail` per venue as the admin. Route paths may still read by role (`/app/admin/...`, `/app/merchant/...`) — the path is for the person, the folder is for the code. Mode-specific chrome is data, not components: one `BottomNav` (`widgets/layout`) gets its tabs from `NAV_TABS[viewMode]` (admin, merchant; the buyer has the footer) and shows only on those root paths, which are also `useBackButton` `ROOT_PATHS`. Tabs are equal width, so labels must fit ~70px at 360px in every locale (kg is the longest) — if a label doesn't fit, shorten the tab label and keep the page's full title. One word per thing across roles: the owner's tab is «Сертификаты» like the buyer's (a code is the certificate's number, not a separate thing)
- **When to add a module group:** its third screen, or Steiger complaining — not in advance

**Inside a slice:** segments `model/` (schemas, types, query keys), `api/`, `hooks/`, `ui/`; each component in its own folder with `index.tsx`; the slice's public API only through its root `index.ts`. Slices of one layer never import each other — e.g. `useOrderPolling` invalidates `["certificates"]` by a literal key instead of importing `certificateKeys`

## Code

- **Arrow functions only** — no `function` declarations
- **`useState` first**: in components and hooks, declare local state before other hooks (`useTranslation`, `useNavigateTo`, queries, …) where possible
- **Tailwind spacing**: whole numbers or 0.5 steps only (1, 1.5, 2, 2.5…) — never 0.75 or arbitrary `[Npx]`
- Comments only when the `WHY` isn't obvious
- No unnecessary abstraction — three similar lines beat a premature helper
- **Navigation**: always `useNavigateTo` from `@shared/hooks` — never `useNavigate` directly
- **Routes**: only through `ROUTE_PATTERNS` and the `get…Route()` helpers from `@shared/constants` — no hardcoded strings
- **TMA launch params**: only through `getLaunchParams()` from `@shared/helpers` — never `retrieveLaunchParams()` from the SDK directly
- **Configs** (`vercel.json`, BotFather, CI): don't change without explicit approval
- **Edit forms**: the page gates on the query (spinner → not-found → form) and passes loaded data as a prop into `defaultValues` — no `useEffect` + `reset()` (it wipes input typed while loading)
- **Bottom sheets**: `BottomSheet` (`@shared/ui`) — slides up, closes by backdrop / Escape / swipe down on its header (not the body: a textarea must still scroll and select), `dismissible={false}` while saving; pass `children` as a function to get the animated `close` for a «Отмена» button. Portaled to `<body>`: `<main>`'s enter animation makes its own stacking context, so anything fixed inside it sits under the bottom nav. Use it when the native `popup` isn't enough (it can't take input)
- **Lists**: `isLoading` → skeleton, `isError` → `<ErrorState onRetry isRetrying />`, empty → `EmptyState`, else list. Query hooks return `retry` + `isFetching` for this
- **UI state that TMA buttons target** (e.g. profile `?tab=`) lives in search params, not `useState` — the page may already be mounted when the button navigates
- `QUERY_CLIENT` sets `placeholderData: keepPreviousData` globally — on a key change within a mounted component `isLoading` stays false and the previous key's data shows. Harmless today (pages remount on navigation), but wherever a key can change while mounted and stale data would be wrong (route params without remount, anything feeding a purchase), gate on `isPlaceholderData` or set `placeholderData: () => undefined` on that query (a literal `undefined` fails `exactOptionalPropertyTypes`)
- `QUERY_CLIENT` retries once, and only network errors / 5xx — 4xx and `ZodError` fail immediately
- **Allowed venue values** (nominals, validity months) come only from `GET /venues/options` (`useVenueOptionsQuery`, staleTime ∞) — no frontend list. Forms build their Zod schema from it (`createVenueFormSchema(options, withAdminFields)`), pages gate on it like on the venue query
- **Certificate codes are 8 digits, always a string** (leading zeros: `04718263`) — never `type="number"` / `Number()` / `parseInt`. Shown as `0471 8263` everywhere via `formatCertificateCode` (`@entities/certificate`), like the bot's messages; copied as plain digits. Typed input → `toCertificateCodeDigits`. The backend accepts spaces / dashes
- **Dates are shown in Bishkek time** (`formatDate` / `formatDateTime`, `Asia/Bishkek`), not the device zone — payout weeks, validity and redemption are business time. Calendar dates the backend sends as `YYYY-MM-DD` (payout weeks) are handled as strings: `formatIsoDate`, `shiftIsoDate` — never through `new Date()` in the local zone
- `useSwipeNavigation`: swipe from the left edge → back, from the right edge → forward — intentional, not a bug
- **Nullable in Zod schemas**:
  - `.nullable()` only for a real domain absence, with a comment next to it citing the source in `../backend` (entity column / DTO / service mapping)
  - fields that depend on a status/type → `z.discriminatedUnion`, not nullable (e.g. `OrderSchema`: each variant lists only the fields its status guarantees; `z.object` strips the backend's nulls for the rest)
  - a backend null the UI doesn't care about → normalize in the schema at the boundary (`.transform`), don't carry it into components
  - also check the reverse: a backend column that's `nullable: true` but required in our schema fails Zod for the whole response (one bad row breaks a list)

## TMA SDK

Initialization in `src/app/providers/tma/index.tsx`:
- `themeParams.mount()` — mounted first (needed for MainButton)
- `miniApp.mount()` + header/background colors
- `swipeBehavior.disableVertical()`
- `viewport.mount()` → `bindCssVars()` → `requestFullscreen()`

Shared TMA hooks in `src/shared/hooks/tma/`:
- `useBackButton` — native "Back" button
- `useHaptic` — haptic feedback (`light`, `medium`, `selection`)
- `useMainButton` — native action button at the bottom of the screen
- `useSafeArea` — safe area
- `useSettingsButton` — settings button

Always check `isAvailable()` before calling SDK methods.

- `AuthProvider` resets `viewMode` from `role` on every login (intentional) — "view as buyer" lasts only until reload; the sessionStorage persist barely matters
- System theme source: `themeParams.isDark` (Telegram's theme, guard with `isMounted()` — unmounted it reports `true`) — never `miniApp.isDark`, it reflects our own `setBgColor`
- `POST /auth/log-in` → 401 (initData > 24h; Telegram doesn't refresh it while open or on reload) sets `isSessionExpired` → `AuthProvider` renders `SessionExpiredPage` ("reopen the app"). Set from both the initial log-in and the 401 re-login in `api.ts`
- **Bot messages (`requestWriteAccess`)** — the bot can message a person only after they started it or allowed it. Via `requestBotMessages()` / `hasWriteAccess()` (`@shared/helpers`): skipped when initData has `user.allows_write_to_pm`, never throws, a refusal blocks nothing. Buyer: asked at purchase, before `createOrder` → `openLink`, at most once per session (`oncePerSession`) — never on first launch. Owner: «Уведомления о продажах» section in profile settings (`widgets/profile` → `NotificationsSection`, shown by `role === "merchant"`, not view mode), asks on every tap until allowed. Bot language = `Accept-Language`, sent on every request incl. `log-in` (plain axios in `shared/api/auth.ts`, set by hand). Message logic: `../backend/CLAUDE.md`, section "Bot"
- **«Подарить» (`useCertificateShareButton`)** — MainButton for an active certificate, on the certificate screen and the paid order. With `shareMessage` (Mini Apps 8.0+): `POST /certificates/:id/share` (a new card per tap — it expires; language = `Accept-Language`) → `shareMessage(preparedMessageId)` sends the bot's card from the buyer; a closed picker rejects — ignored; 409 → refresh certificates + «уже погашен или истёк»; 502 / other → «Не получилось…». Older clients: «Поделиться» — text via `shareURL` (closes the Mini App). The order response has no certificate id — the paid-order screen finds it in «Мои сертификаты» by code
- An owner gets the `merchant` role on `POST /auth/log-in` by matching the merchant's `telegramId` — so the admin can create a merchant before that person ever opened the bot
- Deactivated merchant (`isActive: false`, hides all its venues from buyers): `GET /merchants/me` still works, `PATCH /merchants/me/venues/:id` → 403. Cabinet shows `MerchantDeactivatedNotice` and hides edit; a 403 on save refetches "me" so the edit page swaps to the notice

**Worth adding (when there's time):**
- `ClosingBehavior.enableConfirmation()` — guard against accidentally closing the app on the payment screen (swipe/back)
- `Popup.show` — native confirmation dialogs instead of custom modals (e.g. "Mark as used?")
- `QrScanner` — merchant scans the code instead of typing it (planned, see **TODO** → redemption)

**Doesn't fit the product / don't add without a reason:**
- `Invoice` (`openInvoice`/`openSlug`) — that's Telegram Stars, our payments go through Finik/Bakai/Freedom
- `Biometry`, `LocationManager`, `SecureStorage`, `emoji-status`, `shareStory` — not relevant to this product
- `requestPhoneAccess`/`requestContact` — business model: "no phone number required"
- `CloudStorage` — do NOT use it for the auth token/language/theme: `i18next-browser-languagedetector` is synchronous, `CloudStorage.getItem` is async → incompatible without a flash of the wrong language on render; there's no meaningful benefit for the token or theme either (see `AuthProvider` — re-authenticating via `initData` is already transparent). Only fits non-critical data that's fine to load in a bit later (once such a feature exists)

## Mutation feedback

No success toast/message pattern yet — mutations that redirect on success (e.g. `createCategory` → back to the categories list) rely on haptic + the result being visible on the destination page, which is enough on its own.

**Worth adding (when there's time):** a minimal custom toast (own component + small store/hook, same "hand-roll it, don't pull a library" approach as `ErrorBoundary`) for mutations that *don't* navigate away on success (e.g. future "Mark as used", inline edits) — those need a visible confirmation since there's no destination-page context to imply success.

## Payment flow — notes for when it's built

- **Selected nominal can go stale**: `VenueContent` keeps `selectedNominal` in `useState`, but `venue.nominals` can change under it (refetch after a language switch — the detail key includes `lang` — or the owner editing nominals). Before buying, re-derive it: `venue.nominals.includes(selectedNominal) ? selectedNominal : venue.nominals[0]`, and send `venueId` + nominal so the backend validates against the current list — never trust the client's amount
- The venue detail query feeds the purchase — mind `keepPreviousData` (see Code) there

## TODO

- **Return after payment — waiting for diagnostics.** In production Finik's redirect landed the buyer in the bot chat with an error instead of the Mini App. Opening `startapp=order_<uuid>` by hand works (frontend routing is fine). The backend is diagnosing the `RedirectUrl` — see `../backend/CLAUDE.md` ("Payment RedirectUrl → back to the order")
- **Redemption (frontend):** ✅ all on the «Сертификаты» tab (`/app/merchant/certificates`, `widgets/merchants/certificate-list`), no separate page. A code field on top (`inputMode="numeric"`; keeps only digits, at most 8, shown as `0471 8263` while typing; no `maxLength` — it would cut a pasted «Код: 0471 8263» before the digits are picked out): at 8 digits → `GET /merchants/me/certificates/:code` → the card right below (400 «Неверный формат кода», 404 «Сертификат не найден»). Active → «Погасить» → native confirm popup (no undo) → `POST …/redeem`; success clears the field for the next customer, keeps a «Сертификат погашен» card until they type, and refetches the list; 409 re-fetches the GET so the card shows why. Tapping any row opens the same card in a `BottomSheet` (looked up again; «Погасить» only for active). Both are one component, `CertificateLookup` (query + confirm + redeem + card). ✅ Weekly summary (`/app/merchant/summary`) and the list are refreshed after a redemption, never polled. Still to do:
  - QR scanner: an icon at the right of the code field → `qrScanner.capture` with a predicate accepting only 8-digit codes — it just fills the same field
  - QR code rendered from the certificate code on the buyer's certificate screen, so the owner can scan it
- ✅ **Admin «Заказы» and «Выплаты»** (2026-10-21). «Выплаты»: `/app/admin/payouts` (`widgets/payouts`, `entities/payout`, `GET /admin/payouts?week=` — the same numbers as `npm run report:payouts`, shown as sent, never recomputed); `needsReviewCount > 0` → a warning linking to `getAdminOrdersRoute("needs_review")`. Marking paid out (`POST /admin/payouts {merchantId, week, note?}`, shown while `due > 0`): a confirm sheet (`MarkPaidSheet` on `BottomSheet`), the amount is never sent — the server pays what's due, the success popup shows the server's number; 409 `nothing_to_pay_out` = already marked → refetch. **No undo in the app — a mark on prod is a real payout record.** Row states from `paidOut` / `due`: paid ✓ / due / top-up; under each row the week's recorded marks (`payouts[]`: amount · time · note — admin-only, the owner never sees notes); the owner's summary shows the same status (only without the venue filter); orders with `payoutId` get «Выплачен». «Заказы»: `orders/` module — list `/app/admin/orders` (status chips + search in the URL; search 400 → «Введите код…») and detail `/app/admin/orders/:id` with Finik webhooks (Finik's amount next to the order's, a mismatch highlighted), certificate and manual resolutions. Read-only: resolving needs_review stays a backend script. Not used yet: the `venueId` / `merchantId` filters (e.g. «orders of this merchant» from its page)
- **Bottom nav sits too high** — consider lowering it: now `mx-4 mb-4` above the safe area. Check on a real iPhone (home indicator) before changing. Also: admin kg «Буйрутмалар» is truncated below 375px, and at 320px kg labels truncate in the admin nav

**Verified on a real device:**
- `openLink` called after `await createOrder` opens the Finik page by itself on a real iPhone (2026-10). The "Open payment" MainButton on the order screen stays as the fallback path (e.g. the user closed the bank page, or a client that ignores `openLink` outside a gesture)

## i18n

Locale files: `src/shared/locales/{ru,kg,en}/common.json`
When adding a new key — add it to all three files.
Locale files are exactly `JSON.stringify(obj, null, 2) + "\n"` — safe to edit programmatically
**Terminology:** the word «мерчант» (any case/form) is allowed only in the `en` locale ("merchant"). In `ru`/`kg` user-facing text use a normal word: «заведение» / «мекеме» for the venue, «Владелец» / «Ээси» for the merchant account, «Кабинет» for the merchant's own mode. In code, **`venue`** = the storefront everywhere (`entities/venue`, `pages/venue`, `venues/` module, i18n `venue.*`, `venueForm.*`, `admin.venues.*`); **`merchant`** = the owner account (`entities/merchant`, `merchants/` module, `merchantForm.*`, `admin.merchants.*`, the cabinet)

## Testing

No test setup exists yet (no Vitest/Jest, no test files, nothing in `package.json`). Correctness is currently covered only by `pnpm typecheck` + `pnpm lint` + manual testing in the browser/Telegram.

Worth adding once the codebase grows past the 2-merchant MVP stage:
- **Vitest** — unit tests for pure logic in `@shared/helpers` (e.g. `getScopedStorageKey`, `formatMoney`) and Zod schemas in `entities/*/model`
- **React Testing Library** — component tests for anything with real branching logic (e.g. `VenueContent`/`VenueNotFound` state switching in `pages/venue`)
- **Playwright** (or similar) — e2e for the critical path only: deep link → venue page → pick amount → buy, since that's the entire business

Not a priority before the payment flow ships — don't add test infra just to have it.

## Commands

```bash
pnpm dev          # dev server
pnpm typecheck    # tsc -b (same as the pre-push hook)
pnpm lint         # eslint
pnpm lint:fix     # eslint --fix
```

Pre-push hook (lefthook): lint → steiger (FSD) → typecheck (`tsc -b`)

## Git

Commits are signed by Alisher only. No `Co-Authored-By`.

Workflow for fixes: one fix per commit → push to `dev` → Alisher verifies in Telegram → next fix

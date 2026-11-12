# kuttuk-time-frontend

Telegram Mini App for buying gift certificates.

## Business model

**KuttukTime** - a gift certificate platform for local businesses (coffee shops, restaurants, spas, fitness studios) in Kyrgyzstan.

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
- Month 1-2: 2 merchants, 20-50 orders/week, validate the model
- Month 3-4: 5-10 merchants, 100+ orders/week
- Month 6+: 20-50 merchants, 500+ orders/week, personal merchant links
- Year+: 100+ merchants, expansion to other cities in Kyrgyzstan

## Product decisions

Source of truth: `../backend/CLAUDE.md`, section **Product decisions** - don't duplicate it here. The ones that shape the frontend:
- Roles are only `user` / `merchant` / `admin` - no staff/cashier role; the merchant (owner) redeems certificates
- **merchant ≠ venue.** `merchant` = the owner's business account (role, cabinet, payouts, `isActive`, `telegramId`); `venue` = a storefront the buyer sees and buys from. One merchant owns one or more venues. `venue` is data, not a role
- A certificate is redeemed in full - no partial redemption

## Где остановились - читать первым (обновлено 2026-11-11)

**Rule (Alisher, 2026-11-11, same as the backend's):** after every step - a commit, a push, a report - update this section: what's on prod, what's waiting on the backend / on Alisher, what's next. A new chat must be able to continue from here without asking. It's a docs-only change: it rides with the next code push, never pushed alone.

- **On prod** (`dev` = prod, pushed 2026-11-11 after the backend went to Neon): everything in this file, including task 8 - the website mode (see «Website mode»), task 9 (a website guest only browses: buying / claiming after «Войти через Telegram»), task 10 («Log In With Telegram», OIDC) and the legal texts («О нас», «Оферта», «Политика конфиденциальности», the agreement line above «Купить»).
- **Committed, not pushed:** the UI decisions of 2026-11-12 (compact inactive certificates, profile header, kg tab labels, `RowGroup` on the venue card, description tabs) - report sent, push on «пуш». Next: the dependency audit steps 2-5 on Alisher's order, a report each. Node 26 with the backend. TypeScript 7 / tma.js v4 - wait.
- **Waiting on Alisher:** a check of the website in a plain browser (guest buy → Finik → `/orders/<id>`, «Подарить» share menu, «Войти через Telegram»).
- **Waiting on the backend:** nothing. On prod the venues' addresses / map links and the merchants' payout details / contacts are test placeholders.
- **Next:** check the website on a phone with Alisher (incl. the legal pages and the sign-in before buying); then the next prompt. Parked («когда понадобится»): `shareStory`, inline mode, venue-QR PNG for phones, «Сегодня: N продаж», `ClosingBehavior` confirmation, a toast; a custom domain, SEO pages, SMS sign-in (backend plan).
- **How tasks arrive:** Alisher pastes a prompt written by the backend agent (contract in `../backend/CLAUDE.md`); report what's done / committed / on prod, kg texts for review, the commit list before a push; push only on «пуш» (or «можно сразу»).

## Who decides what

(Alisher, 2026-11-04, sharpened 2026-11-10)
- **Strict split.** The frontend agent does only the frontend, the backend agent only the backend. The backend agent never edits this repo: it sends prompts, and the frontend agent does the work. The frontend agent reads `../backend` only to check the contract, never edits it
- **Shared rules and decisions** (product, API contract, tone, dashes, pushing, deploys, the task plan) are kept by the backend agent in `../backend/CLAUDE.md` and `../backend/docs/workflow.md` - the source of truth
- **Sync:** if this file disagrees with those on a shared question, the backend's is right - tell Alisher, don't settle it here on your own. Frontend-only rules (code style, FSD, SDK usage, tests) live here

## Only the new stable (Alisher, 2026-11-11, global)

Libraries, SDKs, external APIs, sign-in methods - always the current **stable** one. Before building on anything external, read its current official docs (not from memory): is it deprecated / archived / legacy, is there a newer stable version. Pre-release only when Alisher asks. Audit order (2026-11-11, each step on Alisher's «го», a report per step): 1) minor updates + Playwright 1.65 + CI `ubuntu-latest`; 2) the test stack together - vitest 5 + jsdom 31 + msw 3 (done 2026-11-12, see Testing); 3) react-router 8 (done 2026-11-12); 4) i18next 27 + react-i18next 18; 5) small majors - @hookform/resolvers 7, simple-import-sort 14, steiger 0.10 + plugin 0.8; 6) Node 26 with the backend. Waiting: TypeScript 7 (no API before 7.1, typescript-eslint < 6.1), tma.js v4 (rc only). Example of what this rule catches: the website's sign-in was built on the old Telegram Login Widget (archived by Telegram) - the current one is «Log In With Telegram» (OIDC, https://core.telegram.org/bots/telegram-login).

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **TanStack Query** - server state
- **Zustand** - client state
- **React Router v8** - routing (data mode; `RouterProvider` from `react-router/dom`, everything else from `react-router`)
- **@tma.js/sdk-react** - Telegram Mini Apps SDK
- **react-i18next** - i18n (locales: `ru`, `kg`, `en`)
- **Zod** - API response validation
- **pnpm** - package manager

## Architecture - FSD

Layers (imports only go downward through this list):

```
app → pages → widgets → features → entities → shared
```

Path aliases: `@app`, `@pages`, `@widgets`, `@features`, `@entities`, `@shared`

**Where code goes - ask in this order:**
1. **No business word in it** (formatting, SDK wrappers, UI kit, routes, locales) → `shared`, split by segment, no modules
2. **One entity's data or plain display of it** (schema, API, query hooks, card) → `entities/<entity>`, by domain, not by screen or role: `venue` (storefront), `merchant` (owner account), `category`, `order`, `certificate`, `payout` (admin weekly report) - same names as the backend API. Cross-entity imports only via `@x` (`entities/venue/@x/merchant.ts` → `MerchantMe.venues`)
3. **An action reused by two or more widgets** → `features/<action>`. With a single consumer the action lives in its widget - a create/edit form is one widget, not a feature. Today: `category-filter` (buyer home + admin venue list), `venue-filter` (owner's summary + certificate list; hidden for a single venue)
4. **A block of one page** → `widgets`, grouped by module
5. **The rest** (route params, gating on queries, picking a widget) → `pages`. A page is the route and nothing else: `index.ts` + one component, no `hooks/` / `helpers/` / `model/`, queries inline

**Modules - by what the person is doing, never by role** (same rule as in `kca-frontend-private`):
- buyer flow, flat: `home`, `venue` (`/app/venues/:handle`), `order`, `certificate`, `profile`
- `venues/` - managing venues: list / create / detail / edit (admin, any venue), own-edit (owner, own venue). Widgets `venue-list`, `venue-detail`, `venue-form`
- `merchants/` - merchant accounts: list / create / detail / edit (admin), cabinet / summary / certificates (owner; redeeming lives on the certificates tab). Widgets `merchant-list`, `merchant-detail`, `merchant-form`, `week-summary`, `certificate-list`
- `categories/` - list / create / edit; widgets `category-list`, `category-form`
- `orders/` - admin orders: list / detail (the buyer's own order screen stays flat `order`). `payouts` (`/app/admin/payouts`, weekly payout report) - flat until it grows. «Выплаты», not «Платежи»: the tab is the weekly payout to merchants, not incoming payments
- **Roles change permissions, fields and endpoints - not folders.** One screen serves every role that uses it: `venue-form` takes `variant: create | edit | own` (admin: slug, owner, status, `/admin/venues`; owner: storefront fields only, `PATCH /merchants/me/venues/:venueId`); the cabinet home shows the same `VenueDetail` per venue as the admin. Route paths may still read by role (`/app/admin/...`, `/app/merchant/...`) - the path is for the person, the folder is for the code. Mode-specific chrome is data, not components: one `BottomNav` (`widgets/layout`) gets its tabs from `NAV_TABS[viewMode]` (admin, merchant; the buyer has the footer) and shows only on those root paths, which are also `ROOT_PATHS` in `useGoBack` (no Back button, no swipe back). Tabs are equal width, so labels must fit ~70px at 360px in every locale (kg is the longest) - if a label doesn't fit, shorten the tab label and keep the page's full title. Admin kg tabs (2026-11-10): «Заказ» and «Төлөм» - the page titles stay «Буйрутмалар» / «Төлөп берүү»; kg «Мекеме» (admin and owner) and «Сертификат» (owner) since 2026-11-12 - «Мекемелер» / «Сертификаттар» hit the tab's edge at 320 px; ru unchanged. One word per thing across roles: the owner's tab is «Сертификаты» like the buyer's (a code is the certificate's number, not a separate thing)
- **When to add a module group:** its third screen, or Steiger complaining - not in advance

**Inside a slice:** segments `model/` (schemas, types, query keys), `api/`, `hooks/`, `ui/`; each component in its own folder with `index.tsx`; the slice's public API only through its root `index.ts`. Slices of one layer never import each other - e.g. `useOrderPolling` invalidates `["certificates"]` by a literal key instead of importing `certificateKeys`

## Code

- **Arrow functions only** - no `function` declarations
- **`useState` first**: in components and hooks, declare local state before other hooks (`useTranslation`, `useNavigateTo`, queries, …) where possible
- **Tailwind spacing**: whole numbers or 0.5 steps only (1, 1.5, 2, 2.5…) - never 0.75 or arbitrary `[Npx]`
- Comments only when the `WHY` isn't obvious
- No unnecessary abstraction - three similar lines beat a premature helper
- **Navigation**: always `useNavigateTo` from `@shared/hooks` - never `useNavigate` directly
- **Routes**: only through `ROUTE_PATTERNS` and the `get…Route()` helpers from `@shared/constants` - no hardcoded strings
- **TMA launch params**: only through `getLaunchParams()` from `@shared/helpers` - never `retrieveLaunchParams()` from the SDK directly
- **Configs** (`vercel.json`, BotFather, CI): don't change without explicit approval
- **Edit forms**: the page gates on the query (spinner → not-found → form) and passes loaded data as a prop into `defaultValues` - no `useEffect` + `reset()` (it wipes input typed while loading)
- **Reuse the shared building blocks instead of copying their markup**: `PageLoader` (a screen's loading spinner; `fullScreen` outside the layout), `PillButton` (the main round button), `StatusScreen` (a whole-app screen: session expired, connection failed), `ErrorState` / `EmptyState`, `WeekSwitcher` + `useWeekParam`, `useSearchParamState`, `useOpenSupport`, `useGoBack`; for a certificate's code - `CertificateCodeBlock` (status, code with its date, QR while active); any QR - `QrCode` (`@shared/ui`, black on white); a card-wide link row - `RowButton`; rows that belong together - `RowGroup` (one card, hairlines between, like Telegram's settings; e.g. the venue card's «Ссылка для соцсетей» + «Заказы заведения»); a secondary action - a text button (`min-h-11`), never a filled pill or a card of its own (Alisher, 2026-11-11: «где можно компактно - компактно»); the bot-messages switch - `useBotMessages`; **a pick from a list - `Select`** (`@shared/ui`: a form field or a filter pill → a bottom sheet with 48 px rows, one or many - «Готово» on the sheet's title line, × to reset); **a searched pick - `Combobox`** (type in the field, the matches open right under it, in the page flow). **Never a text input inside a bottom sheet** (Alisher, 2026-11-11): on iPhone the keyboard breaks a fixed sheet - search goes in a `Combobox` on the page, or the sheet lists everything. Chips (`ChipSelect`) only for a few short values that fit a 320 px row (categories, validity)
- **Bottom sheets**: `BottomSheet` (`@shared/ui`) - slides up, closes by backdrop / Escape / swipe down on its header (not the body: a textarea must still scroll and select), `dismissible={false}` while saving; pass `children` as a function to get the animated `close` for a «Отмена» button. Portaled to `<body>`: `<main>`'s enter animation makes its own stacking context, so anything fixed inside it sits under the bottom nav. Use it when the native `popup` isn't enough (it can't take input)
- **Lists**: `isLoading` → skeleton, `isError` → `<ErrorState onRetry isRetrying />`, empty → `EmptyState`, else list. Query hooks return `retry` + `isFetching` for this
- **UI state that TMA buttons target** (e.g. profile `?tab=`) lives in search params, not `useState` - the page may already be mounted when the button navigates
- **`placeholderData: keepPreviousData` only where a key changes while mounted and the old rows are still right to show** - lists with search / filters (`useVenuesQuery`, `useAdminVenuesQuery`, `useAdminMerchantsQuery`) and the language-keyed `useCategoriesQuery`. Not global: everywhere else a new key starts empty (`isLoading`), so nothing stale shows under a new week, order, code or venue
- `QUERY_CLIENT` retries once, and only network errors / 5xx - 4xx, `ZodError` and a **timeout** fail immediately
- **Timeouts** (`@shared/constants` env): every request 15 s, log-in 45 s (Koyeb wakes for up to ~30 s; after 3 s the loader says «Запускаем сервер…»), upload 60 s - a hung connection ends in «Повторить», never an endless spinner
- **Detail pages tell 404 from an error**: query hooks return `isNotFound` (404 only) + `retry`; the page shows not-found for 404 and `ErrorState` for network / 5xx - a dropped connection must not read as «not found»
- **Narrow screens (320 px, kg is the longest)**: a status badge, price or button never sits in a row beside a name - it goes under it, and the name wraps (`line-clamp-2/3 wrap-break-word`), not `truncate` to three letters. The header's mode badge keeps only its icon below 360 px
- **Allowed venue values** (nominals, validity months, `nameMaxLength`) come only from `GET /venues/options` (`useVenueOptionsQuery`, staleTime ∞) - no frontend list. Forms build their Zod schema from it (`createVenueFormSchema(options, withAdminFields)`), pages gate on it like on the venue query
- **Certificate codes are 8 digits, always a string** (leading zeros: `04718263`) - never `type="number"` / `Number()` / `parseInt`. Shown as `0471 8263` everywhere via `formatCertificateCode` (`@entities/certificate`), like the bot's messages; copied as plain digits. Typed input → `toCertificateCodeDigits`. The backend accepts spaces / dashes
- **Dates are shown in Bishkek time** (`formatDate` / `formatDateTime`, `Asia/Bishkek`), not the device zone - payout weeks, validity and redemption are business time. Calendar dates the backend sends as `YYYY-MM-DD` (payout weeks) are handled as strings: `formatIsoDate`, `shiftIsoDate` - never through `new Date()` in the local zone
- `useSwipeNavigation`: a swipe right from the left edge = the Back button (`useGoBack`: previous screen, else the mode's home; nothing on root screens). No forward swipe
- **Nullable in Zod schemas**:
  - `.nullable()` only for a real domain absence, with a comment next to it citing the source in `../backend` (entity column / DTO / service mapping)
  - fields that depend on a status/type → `z.discriminatedUnion`, not nullable (e.g. `OrderSchema`: each variant lists only the fields its status guarantees; `z.object` strips the backend's nulls for the rest)
  - a backend null the UI doesn't care about → normalize in the schema at the boundary (`.transform`), don't carry it into components
  - also check the reverse: a backend column that's `nullable: true` but required in our schema fails Zod for the whole response (one bad row breaks a list)

## Website mode (2026-11-11, task 8)

The same app outside Telegram is the buyer's **website** (../backend `docs/web-version.md`): in Kyrgyzstan Telegram reads as spam to many - buyers need a plain site.
- **Mode:** `useAppModeStore` (`@shared/store`, `isWebsite()`), set once at start by `TMAProvider`: the SDK's `init()` works only with Telegram's launch params - otherwise `web`. Outside Telegram the SDK's `isAvailable()` / `isSupported()` just answer false, but `retrieveRawInitData` throws and `miniApp.isActive` reads false - never use them on the website
- **Screens:** buyer only - catalog, venue, order, «Мои сертификаты», gift, «О нас», «Оферта», «Политика конфиденциальности» (`/app/about`, `/app/offer`, `/app/privacy` - open in Telegram too). Cabinet / admin routes → `TelegramOnlyPage` («Кабинет владельца работает в Telegram» + the Mini App link); `viewMode` is always `user`; profile settings hide the Telegram-only sections
- **A guest only browses** (task 9, Alisher 2026-11-11 - a guest's purchase got lost when Finik came back in another tab): catalog, venue, the gift screen, their old purchases - as a quiet guest. «Купить» and «Забрать подарок» first open `TelegramLoginSheet` («Войдите через Telegram, чтобы купить / забрать подарок…» + the widget; `needsTelegramLogin()`), and after the sign-in the same action goes on by itself (the same nominal). A 403 `telegram_required` from the backend (`isTelegramRequired`, an old tab) marks the session a guest and opens the same sheet. Signed in: the profile shows the widget's user (`getWebsiteUser`) and «Выйти» (`TelegramSignOut` in settings: forgets the widget's data → a new quiet guest, `resetQueries`). All in `features/telegram-login`
- **One guest at a time** (`signInOnWebsite` / `signOutOnWebsite`): one shared promise per tab and a Web Lock (`navigator.locks`, «kuttuk-time-sign-in») across tabs - the second tab reads the token the first stored, so no extra guests. A reload during a slow first sign-in can still leave an empty guest on the backend (harmless)
- **Sign-in** (`shared/api/web-auth.ts`, task 10 - «Log In With Telegram», OIDC, https://core.telegram.org/bots/telegram-login; the old Login Widget is legacy / archived and gone from the code, a rule test guards it): a guest by itself - `POST /auth/guest { guestToken? }`, the guest's token in `localStorage`. «Войти через Telegram» = `TelegramLoginButton` (`features/telegram-login`): `telegram-login.js?6` from oauth.telegram.org, loaded ahead of the tap; the tap calls `Telegram.Login.auth({ client_id: TELEGRAM_LOGIN_CLIENT_ID (8215578063, the bot's id), scope: ["profile", "write"] (the bot may write; never the phone), lang (kg → "ky") })` synchronously - the popup must open from the tap. The callback's `id_token` → `POST /auth/telegram-oidc { idToken, guestToken? }` → the new JWT **at once** (the guest is merged and deleted), the guest token goes. 401 / 400 or Telegram's error → «Не удалось войти, попробуйте ещё раз»; `popup_closed` → nothing. Kept in `localStorage` (`kuttuk-time-telegram-session`): our JWT, role and the profile from the token's claims (for the profile screen) - **never the id_token**; used while the JWT lives (its `exp`), a 401 on a request drops it → a quiet guest, the next purchase asks Telegram again. The old widget's key is wiped at start. Setup (done 2026-11-11): BotFather → OpenID Connect on, Client ID 8215578063, Trusted Origin `https://kuttuk-time.vercel.app`, no Redirect URIs, RS256; the library sends `redirect_uri` = the page's origin + path - check sign-in from a venue and a gift link on a phone. No COOP header on the site (vercel.json has none) - if one is ever added, `same-origin-allow-popups`, never `same-origin`
- **Telegram stand-ins:** `useMainButton` → a plain button the layout draws (`useWebMainButtonStore` → `WebMainButton`); `usePopup` → `window.confirm` / `alert`; Back - the browser; no edge-swipe back (Safari has its own); theme - `prefers-color-scheme`
- **Buying:** `POST /orders { …, channel: "web" }` → `goToUrl(paymentUrl)` (this tab); Finik returns to `<site>/orders/<id>`. «Подарить»: `POST /certificates/:id/gift-link` → `navigator.share` with the buyer's own words («🎁 Тебе подарок…» - «ты», it's their message), else the link is copied
- **Addresses shared with the backend** (`@shared/constants`, change both sides together - ../backend `src/orders/payment-redirect-url.ts`): `WEB_ORDER_PATH = "/orders/"`, `WEB_GIFT_PATH = "/gift/"` → routes `/orders/:orderId`, `/gift/:token` (the same pages as `/app/orders/…`, `/app/gifts/…`). `vercel.json` already sends every path to `index.html`
- **Footer:** «О нас», «Оферта», «Политика конфиденциальности», «Поддержка: @alisher_zh», «Оплата через Finik»
- **Legal texts** (2026-11-11): the backend's `docs/legal/*.md` is the only source - `src/shared/legal/` holds byte-for-byte copies (`?raw`, a lazy chunk), never edited here; a changed text = copy the file again. `legal.test.ts` compares them with `../backend/docs/legal` when the backend sits next to this repo (skipped on CI; `vitest.config.ts` allows that one folder). Rendered by `Markdown` (`@shared/ui`: headings, paragraphs, **bold**, `- ` / `1. ` lists - a clause «1.1.» stays text; `[label]` → our page via `links`). «О нас» - the `## ru|kg|en` section of `about.md` (`getAboutText`); offer and privacy are ru only - kg / en show «Текст на русском языке» in their language above. The venue page (both modes) has «Оплачивая, вы соглашаетесь с офертой и политикой конфиденциальности» above «Купить», both linked (`venue.agreement`, `Trans`)

## TMA SDK

Initialization in `src/app/providers/tma/index.tsx`:
- `themeParams.mount()` - mounted first (needed for MainButton)
- `miniApp.mount()` + header/background colors
- `swipeBehavior.disableVertical()`
- `viewport.mount()` → `bindCssVars()` → `requestFullscreen()`

Shared TMA hooks in `src/shared/hooks/tma/`:
- `useBackButton` - native "Back" button
- `useHaptic` - haptic feedback (`light`, `medium`, `selection`)
- `useMainButton` - native action button at the bottom of the screen
- `useSafeArea` - safe area
- `useSettingsButton` - settings button

Always check `isAvailable()` before calling SDK methods.

- `AuthProvider` resets `viewMode` from `role` on every login (intentional) - "view as buyer" lasts only until reload; the sessionStorage persist barely matters
- System theme source: `themeParams.isDark` (Telegram's theme, guard with `isMounted()` - unmounted it reports `true`) - never `miniApp.isDark`, it reflects our own `setBgColor`
- `POST /auth/log-in` → 401 (initData > 24h; Telegram doesn't refresh it while open or on reload) sets `isSessionExpired` → `AuthProvider` renders `SessionExpiredPage` ("reopen the app"). Set from both the initial log-in and the 401 re-login in `api.ts`
- **Bot messages (`requestWriteAccess`)** - the bot can message a person only after they started it or allowed it. Via `requestBotMessages()` / `hasWriteAccess()` (`@shared/helpers`): skipped when initData has `user.allows_write_to_pm`, never throws, a refusal blocks nothing. Buyer: asked at purchase, before `createOrder` → `openLink`, at most once per session (`oncePerSession`) - never on first launch. Owner: «Уведомления о продажах» section in profile settings (`widgets/profile` → `NotificationsSection`, shown by `role === "merchant"`, not view mode), asks on every tap until allowed. Bot language = `Accept-Language`, sent on every request incl. `log-in` (plain axios in `shared/api/auth.ts`, set by hand). Message logic: `../backend/CLAUDE.md`, section "Bot"
- **«Подарить» (`useCertificateShareButton`)** - MainButton for a usable certificate (`isUsable`), on the certificate screen and the paid order. With `shareMessage` (Mini Apps 8.0+): `POST /certificates/:id/share` (a new card per tap - it expires; language = `Accept-Language`; private chats only, set by the backend) → `shareMessage(preparedMessageId)` sends the bot's card (the code's QR, «Забрать подарок», «Скопировать код») from the buyer; a new card cancels the previous unclaimed link. Under the code `CertificateGiftHint` explains it (shown only while `canGift`); a closed picker rejects - ignored; 409 → refresh certificates + «уже погашен или истёк»; 502 / other → «Не получилось…». Older clients: «Поделиться» - text via `shareURL` (closes the Mini App). The paid-order screen gets the certificate's effective `status` from `GET /orders/:id` - not active → no QR, no «Подарить», «Использован {date}» / «Истёк {date}» like the certificate screen
- **Start params shared with the backend** (`@shared/constants`, change both sides together): `ORDER_START_PARAM_PREFIX = "order_"` and `MY_CERTIFICATES_START_PARAM = "my_certificates"` and `ADMIN_PAYOUTS_START_PARAM = "admin_payouts"` (../backend `src/orders/payment-redirect-url.ts`), `GIFT_START_PARAM_PREFIX = "gift_"` (`src/certificates/gift-token.ts`). `getStartRoute` reads them **before** the role redirect - for every role: `order_<uuid>` → the order, `gift_<token>` → «Забрать подарок» (`/app/gifts/:token`), `my_certificates` → the profile's certificates tab, `admin_payouts` → «Все долги» for an admin (anyone else - the usual home, never a venue), anything else → the venue by its slug, **also for the owner and the admin** (an owner checking their own link sees the storefront)
- **«Забрать подарок»** (`pages/gift`, `widgets/gift`, `useGiftQuery` / `useClaimGiftMutation` in `entities/certificate`): `GET /gifts/:token` → `{ state, status, amount, validUntil, venue }`, no code. `available` + `active` → «Вам подарок» + MainButton «Забрать подарок» (asks `requestBotMessages` first - for the expiry reminder); `available` + used / expired, `own`, `received` (→ «Мои сертификаты»), `claimed` - a line each, no button; 404 → «Ссылка недействительна…». `POST …/claim` → the certificate (as in `/certificates/my`): put into the "my" cache, then open it (`replace`). 409 `own | already_claimed | already_used | expired` / 404 → the gift is looked up again and the screen shows why. Double tap → one claim (ref guard)
- **«Мои сертификаты»** (2026-11-12): an active certificate is the full card (code, QR on open); used / expired / given away - one compact row: logo · venue, then «сумма · статус с датой», no code
- **Profile** has the app's header like every screen (the bottom logo and the Mini App's brand strip are gone; the website keeps its footer - the offer, the policy). On the website «Выйти» is a small text button on the name's line
- **Venue form description**: one field with RU | KG | EN tabs above (`VenueFormDescription`): ✓ on a filled language, all three still required - a save with one empty turns its tab red and switches to it (on `submitCount`, never while typing)
- **`giftedAt`** (optional, on `/certificates/my` items and `GET /orders/:id` → `certificate`): given away and claimed by a friend. Shown as «Подарен <date>» (+ «· использован» / «· срок истёк» from `status`), **no code, QR or «Подарить»**, the row doesn't open. `isUsable(certificate)` = active and not gifted - the one check for QR / «Подарить» / opening. Order of the list = as the backend sends it
- **Venue share link** (`VenueShareLink` in `VenueDetail` - the owner's cabinet and the admin's venue card): `getVenueShareLink(slug)` (`@shared/constants`) → `${BOT_URL}/app?startapp=<slug>`, never the short koyeb link. Copy (SDK `copyTextToClipboard` - already falls back to `navigator.clipboard` / `execCommand`), «Поделиться» via `shareURL` (hidden when unavailable), the QR large in a `BottomSheet` (a single row on the venue opens it: QR, link, copy, share). «Скачать QR» (PNG from a canvas) only in web clients (`canDownloadFiles`): Telegram's `downloadFile` takes only an https URL, mobile webviews ignore `<a download>` - on a phone the owner screenshots the QR in the sheet
- **Home screen icon** (`useHomeScreen`, `@shared/hooks`; `HomeScreenSection` in profile settings, `role === "merchant"` like notifications): `checkHomeScreenStatus` → `missed` / `unknown` - «Добавить» (`addToHomeScreen`; the answer comes as the `home_screen_added` / `home_screen_failed` event), `added` - «Иконка на главном экране», `unsupported` / an error / no Mini Apps 8.0 - the section isn't shown
- **Venue place** (`address` / `mapUrl` - **required** on every venue shape since 2026-11-11: storefront, managed, `/certificates/my` and `/gifts/:token` → `venue`; plain `z.string()`, a null fails the response): `VenuePlace` (`@entities/venue`) always shows the address and «Открыть на карте» (`openExternalLink`) - on the storefront, the certificate and the gift screen. The venue form (owner and admin) has «Адрес» (≤ 200) and «Ссылка на карту» (https; which map sites - the backend's call: 2GIS / Google Maps / Yandex Maps, 400 → «Нужна ссылка из 2GIS…»), both required: «Сохранить» is off until both are filled, nothing is ever sent as null
- **Gift `from`** (`GET /gifts/:token`): the giver's Telegram first name or null → «{{name}} дарит вам подарок» (the name stays as given, so no case endings) / «Вам подарок». After «Забрать подарок» the certificate opens with `?claimed=1` - «Сертификат ваш - покажите QR на кассе» + the venue's place
- **The owner's cabinet opens on the counter** (`MERCHANT_CERTIFICATES` - the code field) at start and from the logo (`getHomeRoute`). A **scanned** QR asks «Погасить?» (amount, venue, code in the message) as soon as the certificate is found active - once per scan (`confirmOnLoad`); a typed code waits for the tap; «Отмена» leaves the card at the counter
- **Order number** (`number` on `GET /orders/:id` and the admin's orders) = the first 8 characters of the id, upper case (`A1B2C3D4`, ../backend `src/orders/order-number.ts`) - what the buyer quotes to support. The buyer's order screen shows «Заказ №…» under every state (`OrderNumber`, copied on a tap); the admin's list and card show «№…»; the admin's search takes it
- **«Выплаты» (admin)**: opens on the **previous** week (the one to pay for) - `?week=` in the URL, else the backend's current week minus 7 days (never the device clock); `?view=due` - «Все долги» (`GET /admin/payouts/due`, every unpaid week, mark one with `week` = its `from`). One marking flow for both - `useMarkPayout` (widgets/payouts): the sheet and «Все долги» show the owner's payout details (`PayoutDetails` - always there), the success popup says whether the bot reached the owner (`ownerNotified`)
- **Venue form (admin)**: the owner - a `Combobox` searched on the server (`GET /admin/merchants?search=`), name + «Telegram ID …»; nominals - a multi `Select` from `/venues/options`, the chosen as pills inside the field
- **Merchants (admin)**: `payoutDetails` / `contact` - **required** since 2026-11-11 (≤ 500, admin only; plain `z.string()`): in the form «Сохранить» is off until both are filled, nothing is sent as null; the card always shows them; `owner: { lastSeenAt, botReachable }` → `MerchantOwnerStatus` («Заходил …» / «Ни разу не заходил», «Бот: доходит / не доходит», nothing while unknown). The Telegram ID comes from the bot's `/id`
- **Admin «Заказы»**: one search field (order number with or without «№» / «#», certificate code, uuid, Finik transaction id) and a filter row (`OrderFilters`, one line scrolled sideways): status, venue, owner - `Select` pills with ×, the whole lists, no search in the sheet; the buyer has no picker - `?userId=` comes from an order's «ID покупателя» link and shows as a pill with ×. All filters live in the URL (`status`, `venueId`, `merchantId`, `userId`; «Заказы заведения» / «Заказы владельца» on their cards). The card: «Финик не создал платёж» for an expired order with `paymentCreated: false`; needs_review shows the `npm run orders:resolve-review` commands to copy
- **Owner's cabinet**: «Включите уведомления о продажах» banner until the bot may message them (`SaleNotificationsBanner`)
- **Redemption on a bad connection**: no answer (network / timeout) or a 409 right after → the code is looked up again; used within the last 2 min = this tap's success («Сертификат погашен»), not «Уже погашен». The double-tap guard holds until that look-up is done
- **«Купить» → 400** (nominal removed / venue switched off): the venue detail is reloaded, the page shows today's nominals or «not found»
- An owner gets the `merchant` role on `POST /auth/log-in` by matching the merchant's `telegramId` - so the admin can create a merchant before that person ever opened the bot
- Deactivated merchant (`isActive: false`, hides all its venues from buyers): `GET /merchants/me` still works, `PATCH /merchants/me/venues/:id` → 403. Cabinet shows `MerchantDeactivatedNotice` and hides edit; a 403 on save refetches "me" so the edit page swaps to the notice

**Worth adding (when there's time):**
- `ClosingBehavior.enableConfirmation()` - guard against accidentally closing the app on the payment screen (swipe/back)
- `shareStory` for the buyer - later, once live sales start: needs a story image at an https URL from the backend, and a design
- Inline mode (`@kuttuk_time_bot <query>` in any chat → venue cards) - later, with dozens of venues; mostly backend
- «Скачать QR» of the venue link on phones - needs the backend to serve the QR as a PNG at an https URL (like `GET /api/qr/<code>.jpg` for certificates), then `downloadFile(url, name)`. A screenshot is enough for now

**Doesn't fit the product / don't add without a reason:**
- `Invoice` (`openInvoice`/`openSlug`) - that's Telegram Stars, our payments go through Finik/Bakai/Freedom
- `Biometry`, `LocationManager`, `SecureStorage`, `emoji-status` - not relevant to this product
- A chat with a user by ID (`tg://user?id=`) from the Mini App - checked on a phone 2026-11-11: doesn't open; «Написать владельцу» was removed
- `requestPhoneAccess`/`requestContact` - business model: "no phone number required"
- `CloudStorage` - do NOT use it for the auth token/language/theme: `i18next-browser-languagedetector` is synchronous, `CloudStorage.getItem` is async → incompatible without a flash of the wrong language on render; there's no meaningful benefit for the token or theme either (see `AuthProvider` - re-authenticating via `initData` is already transparent). Only fits non-critical data that's fine to load in a bit later (once such a feature exists)

## Mutation feedback

No success toast/message pattern yet - mutations that redirect on success (e.g. `createCategory` → back to the categories list) rely on haptic + the result being visible on the destination page, which is enough on its own.

**Worth adding (when there's time):** a minimal custom toast (own component + small store/hook, same "hand-roll it, don't pull a library" approach as `ErrorBoundary`) for mutations that *don't* navigate away on success (e.g. inline edits; «Погасить» shows its result in place) - those need a visible confirmation since there's no destination-page context to imply success.

## Payment flow - notes for when it's built

- **Selected nominal can go stale**: `VenueContent` keeps `selectedNominal` in `useState`, but `venue.nominals` can change under it (refetch after a language switch - the detail key includes `lang` - or the owner editing nominals). Before buying, re-derive it: `venue.nominals.includes(selectedNominal) ? selectedNominal : venue.nominals[0]`, and send `venueId` + nominal so the backend validates against the current list - never trust the client's amount
- The venue detail query feeds the purchase - never give it `keepPreviousData` (see Code)

## TODO

- **Redemption (frontend):** ✅ all on the «Сертификаты» tab (`/app/merchant/certificates`, `widgets/merchants/certificate-list`), no separate page. A code field on top (`inputMode="numeric"`; keeps only digits, at most 8, shown as `0471 8263` while typing; no `maxLength` - it would cut a pasted «Код: 0471 8263» before the digits are picked out): at 8 digits → `GET /merchants/me/certificates/:code` → the card right below (400 «Неверный формат кода», 404 «Сертификат не найден»). Active → «Погасить» → native confirm popup (no undo) → `POST …/redeem`; success clears the field for the next customer, keeps a «Сертификат погашен» card until they type, and refetches the list; 409 re-fetches the GET so the card shows why. Tapping any row opens the same card in a `BottomSheet` (looked up again; «Погасить» only for active). Both are one component, `CertificateLookup` (query + confirm + redeem + card). ✅ Weekly summary (`/app/merchant/summary`) and the list are refreshed after a redemption, never polled. ✅ QR (2026-10-22): the buyer's active certificate and the paid order show `CertificateQr` (`uqr` `encode` → one SVG path, black on white, the 8 digits without spaces); the owner's code field has a scanner icon (`useQrScanner` → `qrScanner.capture`, hidden where unavailable - desktop / old clients). The scanner's own predicate accepts only exactly 8 digits after dropping non-digits (not cut down like typing) - a stray QR is ignored and the scanner stays open.
- ✅ **Admin «Заказы» and «Выплаты»** (2026-10-21). «Выплаты»: `/app/admin/payouts` (`widgets/payouts`, `entities/payout`, `GET /admin/payouts?week=` - the same numbers as `npm run report:payouts`, shown as sent, never recomputed); `needsReviewCount > 0` → a warning linking to `getAdminOrdersRoute("needs_review")`. Marking paid out (`POST /admin/payouts {merchantId, week, note?}`, shown while `due > 0`): a confirm sheet (`MarkPaidSheet` on `BottomSheet`), the server computes the amount; we send `expectedPayout` (the `due` shown in the sheet) and it records only if its own amount still matches - 409 `amount_changed` = a sale landed meanwhile, nothing recorded → «Сумма изменилась…», the report refetches and the still-open sheet shows the new amount (it reads the row by `merchantId`, not a snapshot); 409 `nothing_to_pay_out` = already marked → refetch; the success popup shows the server's number. **No undo in the app - a mark on prod is a real payout record.** Row states from `paidOut` / `due`: paid ✓ / due / top-up; under each row the week's recorded marks (`payouts[]`: amount · time · note - admin-only, the owner never sees notes); the owner's summary shows the same status (only without the venue filter); orders with `payoutId` get «Выплачен». «Заказы»: `orders/` module - list `/app/admin/orders` (status chips + search in the URL; search 400 → «Введите код…») and detail `/app/admin/orders/:id` with Finik webhooks (Finik's amount next to the order's, a mismatch highlighted), certificate and manual resolutions. Read-only: resolving needs_review stays a backend script. Filters by venue / owner / buyer - see TMA SDK → Admin «Заказы»

**Verified on a real device:**
- `openLink` called after `await createOrder` opens the Finik page by itself on a real iPhone (2026-10). The "Open payment" MainButton on the order screen stays as the fallback path (e.g. the user closed the bank page, or a client that ignores `openLink` outside a gesture)

## i18n

Locale files: `src/shared/locales/{ru,kg,en}/common.json`
When adding a new key - add it to all three files.
Locale files are exactly `JSON.stringify(obj, null, 2) + "\n"` - safe to edit programmatically
**Dashes** (Alisher, 2026-11-10): only the plain hyphen `-`. Never the em dash or the en dash - not in ru / kg / en texts, code, comments, tests, docs, commit messages or reports to Alisher. Date ranges too, without spaces: a week is `09.11-15.11.2026` - the year once (`formatIsoRange`), both years across the new year.

**Tone** (Alisher, 2026-11-04): everything the app says to a person is formal - ru «вы», kg «сиз» / «-ыңыз» (imperatives too: «жазыңыз», not «жаз»), en makes no difference. **Exception** - text the person sends themselves, under their own name («Подарить», a future story caption): «ты» / «сен».

**Terminology:** the word «мерчант» (any case/form) is allowed only in the `en` locale ("merchant"). In `ru`/`kg` user-facing text use a normal word: «заведение» / «мекеме» for the venue, «Владелец» / «Ээси» for the merchant account, «Кабинет» for the merchant's own mode. In code, **`venue`** = the storefront everywhere (`entities/venue`, `pages/venue`, `venues/` module, i18n `venue.*`, `venueForm.*`, `admin.venues.*`); **`merchant`** = the owner account (`entities/merchant`, `merchants/` module, `merchantForm.*`, `admin.merchants.*`, the cabinet)

## Testing

Modelled on `kca-frontend-private`. No request ever reaches prod or real Telegram.
- **Vitest + jsdom + Testing Library + MSW** (`vitest.config.ts`, `vitest.setup.ts`), `globals: false`, tests colocated as `*.test.ts(x)`. MSW 3 `onUnhandledFrame: "error"` (was `onUnhandledRequest` in MSW 2) plus the `request:unhandled` list - an unmocked request fails the test that made it. API base in tests: `http://api.test/api`
- **MSW 3** (2026-11-12): `http` / `HttpResponse` from `msw/http`, `delay` from `msw/utils/delay` - never the root `msw` (its handlers silently don't match). MSW 3 intercepts at the socket, so jsdom's own CORS check runs: `vitest.config.ts` sets jsdom's URL to the API origin (`http://api.test/`), else every mocked answer is a «Network Error» (github.com/mswjs/msw/issues/2803). Vitest 5: `clearMocks` is on by default; `vi.mock` / `vi.hoisted` only at a file's top level; `console.log` in tests isn't shown - write to a file to debug
- `@tests` (`test-utils/`): `renderWithProviders(ui, { route, path, language })` - memory router, a fresh `createQueryClient()`, i18n `ru`; `renderHookWithProviders`. `installTelegram()` stubs the bridge: `window.__telegram` - `calls`, `last(name)`, `emit`, `replies` (popup button, QR text, write access, share result)
- `@mocks` (`mocks/`): `server`, `api(path)`, `fixtures` - shaped like the backend's responses, nulls included
- **Rule tests** (`src/app/*.test.ts`): `useState` first; pages are only `index.tsx`; entity `index.ts` only re-exports; locale key parity; no «мерчант» in ru/kg; `useNavigate` / `retrieveLaunchParams` only through our wrappers
- A guard test (double tap, 409) must fail without the guard - check by removing it. E.g. the SDK refuses a second popup, so the redeem double-tap test answers both confirmations itself and taps twice in one frame
- **E2E - Playwright on mocks** (`e2e/`, `playwright.config.ts`): a prod build (`dist-e2e`) + `MiniApp` (`e2e/support.ts`) with the Telegram stub and routed API. Three flows: buy → paid → «Подарить»; owner redeems; admin marks a payout. Locally, if the browser download hangs: `PW_CHROMIUM_PATH=<a cached Chromium> pnpm test:e2e`
- **CI** (`.github/workflows/ci.yml`, push / PR): install → lint → typecheck → steiger → `test:run` → build → e2e; traces uploaded on failure

## Commands

```bash
pnpm dev          # dev server
pnpm typecheck    # tsc -b (same as the pre-push hook)
pnpm lint         # eslint
pnpm lint:fix     # eslint --fix
pnpm test         # vitest, watch
pnpm test:run     # vitest once (pre-push, CI)
pnpm test:coverage
pnpm test:e2e     # playwright on mocks
```

Pre-push hook (lefthook): lint → steiger (FSD) → typecheck (`tsc -b`) → `test:run`

## Git

Commits are signed by Alisher only. No `Co-Authored-By`. Commit messages use the plain hyphen `-` only (see i18n → Dashes).

**Pushing** (Alisher, 2026-10-22):
- **A push to `dev` is a prod deploy** - Vercel builds `dev`, and it doesn't wait for GitHub Actions: a red commit still reaches users. No PRs to `main`
- **Push in batches.** Commit each verified step locally; push when a task (or a batch of tasks) is done. Docs- or comment-only changes are never pushed alone - they go with the next code push
- **Exception - an urgent prod fix:** push right away
- **Before a push**, run everything CI runs, not just the pre-push hook: `pnpm lint && pnpm typecheck && pnpm steiger ./src && pnpm test:run && pnpm test:e2e && pnpm build`
- **Before a push**, send Alisher the list of commits going out
- **After the deploy**, check what changed on prod: the Vercel deployment is Ready (Vercel MCP), and Alisher opens the prod Mini App in Telegram - the agent can't open Telegram and doesn't send requests to the prod API

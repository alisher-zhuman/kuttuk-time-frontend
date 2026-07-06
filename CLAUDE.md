# kuttuk-time-frontend

Telegram Mini App for buying gift certificates.

## Business model

**KuttukTime** — a gift certificate platform for local businesses (coffee shops, restaurants, spas, fitness studios) in Kyrgyzstan.

**Purchase flow (buyer):**
1. Opened the TMA → picked a merchant → picked an amount → paid → got a code
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

**Rules:**
- Entity UI (`entities/*/ui/`) — reusable components (cards, card skeletons)
- Widget UI (`widgets/*/ui/`) — page-specific components (page skeleton, composite blocks)
- Each component lives in its own folder with `index.tsx`
- A layer's public API is exposed only through the root `index.ts`

## Code

- **Arrow functions only** — no `function` declarations
- **Tailwind spacing**: whole numbers or 0.5 steps only (1, 1.5, 2, 2.5…) — never 0.75 or arbitrary `[Npx]`
- Comments only when the `WHY` isn't obvious
- No unnecessary abstraction — three similar lines beat a premature helper
- **Navigation**: always `useNavigateTo` from `@shared/hooks` — never `useNavigate` directly
- **Routes**: only through `ROUTE_PATTERNS` and `getMerchantRoute()` from `@shared/constants` — no hardcoded strings
- **TMA launch params**: only through `getLaunchParams()` from `@shared/helpers` — never `retrieveLaunchParams()` from the SDK directly
- **Configs** (`vercel.json`, BotFather, CI): don't change without explicit approval

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

**Worth adding (when there's time):**
- `shareURL` (`links`) — share the certificate code in Telegram, this is literally part of the business flow ("the code can be shared in Telegram")
- `ClosingBehavior.enableConfirmation()` — guard against accidentally closing the app on the payment screen (swipe/back)
- `Popup.show` — native confirmation dialogs instead of custom modals (e.g. "Mark as used?")
- `QrScanner.open` — merchant scans the code in the dashboard instead of typing it in manually
- `requestWriteAccess` — do NOT request it on first launch (burns the one shot with no context, adds friction to the 30-second flow). Request it contextually — right after the first successful purchase, at the point of "also send you the code as a backup message." See `../backend/CLAUDE.md` — same place has the bot messaging logic

**Doesn't fit the product / don't add without a reason:**
- `Invoice` (`openInvoice`/`openSlug`) — that's Telegram Stars, our payments go through Finik/Bakai/Freedom
- `Biometry`, `LocationManager`, `SecureStorage`, `emoji-status`, `shareStory` — not relevant to this product
- `requestPhoneAccess`/`requestContact` — business model: "no phone number required"
- `CloudStorage` — do NOT use it for the auth token/language/theme: `i18next-browser-languagedetector` is synchronous, `CloudStorage.getItem` is async → incompatible without a flash of the wrong language on render; there's no meaningful benefit for the token or theme either (see `AuthProvider` — re-authenticating via `initData` is already transparent). Only fits non-critical data that's fine to load in a bit later (once such a feature exists)

## i18n

Locale files: `src/shared/locales/{ru,kg,en}/common.json`
When adding a new key — add it to all three files.

## Testing

No test setup exists yet (no Vitest/Jest, no test files, nothing in `package.json`). Correctness is currently covered only by `pnpm typecheck` + `pnpm lint` + manual testing in the browser/Telegram.

Worth adding once the codebase grows past the 2-merchant MVP stage:
- **Vitest** — unit tests for pure logic in `@shared/helpers` (e.g. `getScopedStorageKey`, `formatMoney`) and Zod schemas in `entities/*/model`
- **React Testing Library** — component tests for anything with real branching logic (e.g. `MerchantContent`/`MerchantNotFound` state switching in `pages/merchant`)
- **Playwright** (or similar) — e2e for the critical path only: deep link → merchant page → pick amount → buy, since that's the entire business

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

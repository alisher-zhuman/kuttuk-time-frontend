# KuttukTime Frontend

Telegram Mini App for buying gift certificates from local venues in Kyrgyzstan. The buyer picks a venue and an amount, pays and gets a code. The owner redeems codes and sees weekly sales. The admin manages venues, orders and payouts.

Conventions, product decisions and architecture notes for contributors are in [CLAUDE.md](CLAUDE.md).

## Tech stack

- **React 19** + **TypeScript 6** (strict), **Vite 8**
- **Tailwind CSS 4**
- **TanStack Query** for server state, **Zustand** for client state
- **React Router 7**
- **@tma.js/sdk-react** for the Telegram Mini Apps SDK
- **i18next**: Kyrgyz (`kg`, default), Russian (`ru`), English (`en`)
- **Zod** to validate API responses
- **Vitest + Testing Library + MSW** for unit and component tests, **Playwright** for e2e on mocks
- **ESLint**, **Steiger** (FSD rules), **lefthook** for the pre-push hook

## Architecture

[Feature-Sliced Design](https://feature-sliced.design/). Imports only go downward:

```
src/
├── app/        # entry, providers, router, global styles, configs
├── pages/      # one component per route
├── widgets/    # blocks of a page, grouped by module (venues/, merchants/, orders/ …)
├── features/   # actions shared by two or more widgets
├── entities/   # venue, merchant, category, order, certificate, payout
└── shared/     # UI kit, hooks, helpers, constants, locales, API client
```

## Getting started

Requires Node.js 24 (`.nvmrc`) and pnpm 11.

```bash
pnpm install
cp .env.example .env   # set VITE_API_URL
pnpm dev
```

Outside Telegram the app shows a "open it in Telegram" screen. To work in a browser, pass launch params in the URL hash, as the tests do in `test-utils/telegram.ts`.

## Environment variables

| Variable       | Description                                   |
| -------------- | --------------------------------------------- |
| `VITE_API_URL` | Backend API base URL, e.g. `https://…/api`    |

## Scripts

| Command              | Description                                  |
| -------------------- | -------------------------------------------- |
| `pnpm dev`           | Dev server                                   |
| `pnpm build`         | Type-check + production build                |
| `pnpm preview`       | Preview the production build                 |
| `pnpm lint`          | ESLint, zero warnings                        |
| `pnpm lint:fix`      | ESLint with autofix                          |
| `pnpm typecheck`     | `tsc -b`                                     |
| `pnpm test`          | Vitest in watch mode                         |
| `pnpm test:run`      | Vitest once                                  |
| `pnpm test:coverage` | Vitest with coverage                         |
| `pnpm test:e2e`      | Playwright e2e on a prod build with mocks    |
| `pnpm steiger ./src` | FSD architecture check                       |

The pre-push hook runs lint, steiger, typecheck and `test:run`. CI on GitHub Actions also runs the build and e2e.

## Localization

Locale files are in `src/shared/locales/{kg,ru,en}/common.json`. Every key goes into all three. The language comes from localStorage, then Telegram's language, then the browser, and falls back to `kg`.

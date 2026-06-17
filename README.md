# KuttukTime Frontend

Frontend for the KuttukTime application.

## Tech Stack

- **React 19** + **TypeScript 6** (strict)
- **Vite 8** — build tool
- **React Router 7** — routing (data router)
- **Tailwind CSS 4** — styling
- **i18next** — localization (Kyrgyz + Russian)
- **ESLint 10** — linting with FSD architectural rules
- **Husky** — pre-push hook (`pnpm run check`)

## Architecture

[Feature-Sliced Design (FSD)](https://feature-sliced.design/) layer hierarchy:

```
src/
├── app/        # Entry point, router, global styles, configs
├── pages/      # Full route pages
├── widgets/    # Composite UI blocks
├── features/   # User interactions / business actions
├── entities/   # Business entities
└── shared/     # Reusable utilities, UI kit, constants
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 9+

### Setup

```bash
pnpm install
cp .env.example .env
# fill in .env values
pnpm dev
```

## Environment Variables

| Variable        | Description      |
| --------------- | ---------------- |
| `VITE_API_URL`  | Backend API base URL |

See [.env.example](.env.example) for the full list.

## Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `pnpm dev`         | Start dev server                     |
| `pnpm build`       | Type-check + production build        |
| `pnpm preview`     | Preview production build             |
| `pnpm lint`        | Run ESLint (zero warnings)           |
| `pnpm lint:fix`    | Auto-fix ESLint issues               |
| `pnpm typecheck`   | Run TypeScript compiler check        |
| `pnpm check`       | Run lint + typecheck (used in CI)    |

## Localization

Supported languages: **Kyrgyz (`kg`)** (default) and **Russian (`ru`)**.

Language is detected from `localStorage` → browser language → fallback `kg`.

Translation files are in `src/shared/locales/`.

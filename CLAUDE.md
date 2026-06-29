# kuttuk-time-frontend

Telegram Mini App для покупки подарочных сертификатов.

## Стек

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** (через `@tailwindcss/vite`)
- **TanStack Query** — серверный стейт
- **Zustand** — клиентский стейт
- **React Router v7** — роутинг
- **@tma.js/sdk-react** — Telegram Mini Apps SDK
- **react-i18next** — i18n (локали: `ru`, `kg`, `en`)
- **Zod** — валидация API-ответов
- **pnpm** — пакетный менеджер

## Архитектура — FSD

Слои (импорт только вниз по списку):

```
app → pages → widgets → features → entities → shared
```

Path aliases: `@app`, `@pages`, `@widgets`, `@features`, `@entities`, `@shared`

**Правила:**
- Entity UI (`entities/*/ui/`) — переиспользуемые компоненты (карточки, скелетоны карточек)
- Widget UI (`widgets/*/ui/`) — компоненты конкретной страницы (скелетон страницы, составные блоки)
- Каждый компонент в отдельной папке с `index.tsx`
- Публичный API слоя только через `index.ts` в корне слоя

## Код

- Только **стрелочные функции** — никаких `function` деклараций
- **Tailwind spacing**: только целые числа или шаг 0.5 (1, 1.5, 2, 2.5…) — никаких 0.75 или произвольных `[Npx]`
- Комментарии только если `WHY` неочевиден
- Без лишней абстракции — три похожих строки лучше преждевременного хелпера

## TMA SDK

Инициализация в `src/app/providers/tma/index.tsx`:
- `themeParams.mount()` — монтируется первым (нужен для MainButton)
- `miniApp.mount()` + цвета хедера/фона
- `swipeBehavior.disableVertical()`
- `viewport.mount()` → `bindCssVars()` → `requestFullscreen()`

Shared TMA хуки в `src/shared/hooks/tma/`:
- `useBackButton` — нативная кнопка "Назад"
- `useHaptic` — тактильный отклик (`light`, `medium`, `selection`)
- `useMainButton` — нативная кнопка действия внизу экрана
- `useSafeArea` — безопасная зона
- `useSettingsButton` — кнопка настроек

Всегда проверять `isAvailable()` перед вызовом SDK методов.

## i18n

Файлы локалей: `src/shared/locales/{ru,kg,en}/common.json`
При добавлении нового ключа — добавлять во все три файла.

## Команды

```bash
pnpm dev          # dev сервер
pnpm typecheck    # tsc -b (то же что pre-push хук)
pnpm lint         # eslint
pnpm lint:fix     # eslint --fix
```

Pre-push хук (lefthook): lint → steiger (FSD) → typecheck (`tsc -b`)

## Git

Коммиты подписывает только Alisher. Никаких `Co-Authored-By`.

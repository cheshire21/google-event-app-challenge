# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Structure

This is a **pnpm + Turborepo** monorepo. All commands should be run from the repo root unless targeting a specific workspace.

**Apps** (`apps/`):
- `web` — Next.js 16 frontend (port 3000)
- `api` — NestJS 11 backend (port 3000 by default; set `PORT` env var to avoid conflict with `web`)

**Packages** (`packages/`):
- `@repo/ui` — shared React component library consumed by `web` and `docs`; components live in `packages/ui/src/*.tsx` and are exported via path aliases (e.g. `@repo/ui/button`)
- `@repo/eslint-config` — shared ESLint configs (`base`, `next`, `react-internal`)
- `@repo/typescript-config` — shared `tsconfig.json` bases (`base`, `nextjs`, `react-library`)

## Commands

All from repo root (uses `pnpm`):

```sh
pnpm dev              # start all apps in watch mode
pnpm build            # build all apps/packages
pnpm lint             # lint all workspaces
pnpm check-types      # type-check all workspaces
pnpm format           # prettier-format all TS/TSX/MD files
```

Target a specific app with Turbo filters:

```sh
pnpm exec turbo dev --filter=web
pnpm exec turbo dev --filter=api
pnpm exec turbo build --filter=web
```

API-specific commands (run from `apps/api/` or use `--filter=api`):

```sh
# Tests
pnpm --filter=api test              # unit tests (jest, matches *.spec.ts)
pnpm --filter=api test:watch        # watch mode
pnpm --filter=api test:e2e          # e2e tests (jest-e2e.json config)
pnpm --filter=api test:cov          # coverage

# API dev
pnpm --filter=api start:debug       # debug mode with --inspect-brk
```

Generate a new UI component (from repo root):

```sh
pnpm --filter=@repo/ui generate:component
```

## Architecture Notes

- **Shared UI**: `@repo/ui` exports directly from source (`".//*": "./src/*.tsx"`) — no build step needed. Consumers import via `@repo/ui/<component-name>`.
- **API bootstrap**: `apps/api/src/main.ts` listens on `process.env.PORT ?? 3000`. When running both `web` and `api` concurrently, set `PORT=3001` (or similar) for the API to avoid port collision.
- **TypeScript configs**: workspaces extend from `@repo/typescript-config`. The `nextjs.json` base is used by `web` and `docs`; `react-library.json` by `@repo/ui`; `base.json` by `api` (NestJS uses its own `tsconfig.build.json` to exclude test files).
- **Turbo task graph**: `build` and `check-types` depend on `^build`/`^check-types` (upstream packages build first). `dev` is uncached and persistent. `lint` depends on upstream lint.

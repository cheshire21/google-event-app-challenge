# Google Events App

A full-stack calendar and booking application that integrates with Google Calendar, built as a monorepo using pnpm + Turborepo.

## What's inside?

**Apps**
- `apps/web` — Next.js 16 frontend (port 3000)
- `apps/api` — NestJS 11 backend (port 3001) with Prisma + PostgreSQL

**Packages**
- `@repo/ui` — shared React component library
- `@repo/eslint-config` — shared ESLint configs
- `@repo/typescript-config` — shared TypeScript configs

## Process and Decisions

### Monorepo setup

Started from a Turborepo scaffold and progressively added the layers needed for a production-quality codebase:

- **Git** — version control from day one
- **ESLint + Prettier** — enforced code style with shared configs across all workspaces
- **Docker** — Compose file to run the full stack (Postgres, API, web) in containers so there are no local setup dependencies
- **Claude Code** — used as the AI development agent throughout the project

### Libraries chosen

Selected from the start to cover the major cross-cutting concerns:

| Concern | Library |
|---|---|
| Forms | React Hook Form + Zod |
| API client | Axios with interceptors |
| Server state | TanStack Query |
| ORM | Prisma |
| API docs | Swagger (NestJS built-in) |
| Auth | Auth0 + custom JWT exchange |
| UI components | shadcn/ui + Tailwind v4 |
| Toasts | Sonner |

### AI-assisted development workflow

The project used a structured agent pipeline to ship each feature:

1. **Agent OS skills** — defined best-practice rules for architecture, component structure, API conventions, and design tokens. These became the source of truth that all agents reference.

2. **Shape-spec driven development** — before implementing any feature, a spec folder was created (`agent-os/specs/`) capturing scope, decisions, and which standards apply. This gave every agent enough context to make the right calls without re-explaining conventions each time.

3. **Four-phase project plan** — a PM agent used the Linear MCP integration to create tickets, organize them into phases, and track progress. Phases covered: core booking CRUD → Google Calendar integration → error handling + accessibility → UX polish (drag-and-drop, toasts).

4. **Pipeline per ticket** — every ticket followed the same four-step flow:
   - PM assigns ticket and moves to In Progress
   - Engineer agent (nestjs-engineer or nextjs-engineer) implements against the spec
   - QA agent verifies each "Done when" criterion against the actual code
   - PM moves to Done after QA passes

5. **Human review loop** — after each spec, the standards and skills were updated to capture patterns that worked well and prevent anti-patterns the AI tended to introduce. Code that was structurally odd or unnecessarily complex was refactored before moving to the next ticket.

This kept velocity high while maintaining consistent architecture — the agents didn't need to rediscover conventions on each ticket because they were encoded in the skills and standards files.

## Running the project

### With Docker

**1. Install Docker and Docker Compose** *(required)*

Download from [docs.docker.com/get-docker](https://docs.docker.com/get-docker/).

**2. Set up environment files** *(required)*

Copy the example env files and fill in your values:

```sh
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

**3. Build and start the full stack** *(required)*

```sh
docker-compose up --build
```

This builds the images, starts Postgres, runs Prisma migrations, and starts both the API (port 3001) and web app (port 3000) in watch mode. Dependencies are installed automatically via the `install` service before the others start.

**5. Stop the stack** *(optional)*

```sh
docker-compose down
```

To also remove the database volume:

```sh
docker-compose down -v
```

---

### Without Docker (local dev)

**1. Install pnpm** *(required)*

```sh
npm install -g pnpm
```

**2. Install dependencies** *(required)*

```sh
pnpm install
```

**3. Set up environment files** *(required)*

```sh
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

**4. Start all apps in watch mode** *(required)*

```sh
pnpm dev
```

Or target a specific app *(optional)*:

```sh
pnpm exec turbo dev --filter=web
pnpm exec turbo dev --filter=api
```

## Tests

Requires the stack to be running (`docker-compose up`).

### Unit tests

```sh
# Docker
docker-compose exec api pnpm --filter=api test

# Local
pnpm --filter=api test
```

Watch mode:

```sh
# Docker
docker-compose exec api pnpm --filter=api test:watch

# Local
pnpm --filter=api test:watch
```

### Coverage

API:

```sh
# Docker
docker-compose exec api pnpm --filter=api test:cov

# Local
pnpm --filter=api test:cov
```

Web (note: script is `test:coverage` — uses Vitest):

```sh
# Docker
docker-compose exec web pnpm --filter=web test:coverage

# Local
pnpm --filter=web test:coverage
```

### E2E tests

```sh
# Docker (requires postgres — already up with docker-compose up --build)
docker-compose exec api pnpm --filter=api test:e2e

# Local
pnpm --filter=api test:e2e
```

### Lint + type-check (all workspaces)

```sh
# Docker
docker-compose exec api pnpm --filter=api lint
docker-compose exec web pnpm --filter=web lint

# Local
pnpm lint
pnpm check-types
```

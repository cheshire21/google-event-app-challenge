# Component Architecture

## Folder Structure

```
apps/web/
├── app/                        # Next.js App Router pages + layouts
├── components/                 # Shared, cross-domain UI
│   ├── ui/                     # shadcn/ui components (auto-generated)
│   └── layout/                 # AppShell, Sidebar, TopBar, BottomNav, FAB
├── features/<domain>/          # Domain-specific code
│   ├── api.ts                  # Axios calls for this domain
│   ├── types.ts                # TypeScript types
│   ├── hooks/                  # useQuery / useMutation hooks
│   ├── components/             # Domain components
│   └── schemas/                # Zod schemas (forms)
└── lib/
    └── utils.ts                # cn() and other utilities
```

## RSC vs Client Components

- Default to React Server Components (no directive needed)
- Add `"use client"` only when the component uses: hooks, browser APIs, event handlers, or context
- Forms, interactive widgets, and anything using React Query must be `"use client"`

## Class Names

Always use `cn()` from `lib/utils.ts` to merge Tailwind classes:

```ts
import { cn } from '@/lib/utils';

<div className={cn('base-class', isActive && 'active-class', className)} />
```

## shadcn/ui

- Components live in `components/ui/` — import as `@/components/ui/button`
- Add components via: `pnpm dlx shadcn@latest add <component>` (from `apps/web/`)
- Never edit generated shadcn files directly — extend via wrapper components

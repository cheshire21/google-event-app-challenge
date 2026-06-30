# Standards for FE-2.3 New Booking Form

The following standards apply to this work.

---

## frontend/component-architecture

Pages in `app/` are thin server components — they only import and render from `features/`. All logic (hooks, state, API calls) lives in `features/bookings/`. `"use client"` is pushed as far down the tree as possible.

Feature dependency rule: features only import from `components/`, `hooks/`, `lib/`, `types/`, `utils/` — never from another feature.

---

## frontend/tailwind-tokens

Nook color utilities: `coral`, `teal`, `brown`, `cream`. All support opacity modifiers (`bg-coral/10`, `text-teal`, `text-brown/75`). Never use hardcoded hex colors or `text-[var(--color-*)]` — the short-form utility names work because tokens are registered in `@theme inline` in `globals.css`.

---

## frontend/testing

Vitest + React Testing Library + jsdom. Colocate spec files next to the component. Wrap every `render()` in a fresh `QueryClientProvider` with `retry: false`. Mock `next/navigation` for hooks that call `useRouter`. Run with `pnpm --filter=web test:run`.

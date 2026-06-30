# Standards for FE-2.5 Cancel Booking Dialog

The following standards apply to this work.

---

## frontend/component-architecture

Pages in `app/` are thin server components. All logic lives in `features/bookings/`. `"use client"` pushed as far down the tree as possible. Features only import from `components/`, `hooks/`, `lib/`, `types/`, `utils/`.

---

## frontend/tailwind-tokens

Nook color utilities: `coral`, `teal`, `brown`, `cream`. Opacity modifiers (`bg-coral/10`, `text-teal`, `text-brown/75`). Never hardcode hex. Never use `text-[var(--color-*)]`.

---

## frontend/testing

Vitest + RTL + jsdom. Colocate spec files next to the component. Wrap every `render()` in a fresh `QueryClientProvider` with `retry: false`. Name the wrapper component (`const Wrapper = ...`) to avoid `react/display-name` lint error. Mock `next/navigation` with `vi.mock`. Run with `pnpm --filter=web test:run`.

# Next.js Architecture Rules

## Pattern: Next.js App Router + Feature-Based

Pages live in `app/` (Next.js owns routing). All real logic lives in `src/` organized by feature. Pages are thin — they only import and render from features.

---

## Folder Structure

```
frontend/
├── app/                        # Next.js routing (thin pages only)
│   ├── layout.tsx              # root layout — mounts Providers
│   ├── providers.tsx           # QueryClientProvider + AuthProvider
│   ├── (auth)/                 # route group — no URL segment
│   │   ├── layout.tsx          # Server Component — <AuthGuard requireAuth={false}>
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   └── (dashboard)/
│       ├── layout.tsx          # Server Component — <AuthGuard requireAuth>
│       └── notes/
│           └── page.tsx
├── components/                 # shared reusable UI
│   ├── ui/                     # shadcn/ui components + base primitives: button, input, form, dialog, label, Skeleton
│   ├── layout/                 # structural components: Sidebar, NotesArea
│   └── <ComponentName>/        # custom global components — each in its own folder
│       ├── ComponentName.tsx
│       ├── ComponentName.spec.tsx
│       └── index.ts
├── features/                   # feature logic
│   ├── auth/
│   │   ├── components/         # AuthGuard (route protection wrapper)
│   │   ├── context/            # AuthContext + AuthProvider
│   │   ├── hooks/              # useAuth, useLogin, useRegister, useLogout
│   │   ├── api.ts
│   │   └── types.ts
│   └── notes/
├── hooks/                      # shared hooks (used by 2+ features)
├── lib/                        # third-party setup (axios, react-query...)
├── types/                      # shared TypeScript types
└── utils/                      # pure helper functions
```

---

## Feature Structure

Each feature follows the same internal structure:

```
features/
├── auth/
│   ├── components/
│   │   ├── AuthGuard/           # each component gets its own folder
│   │   │   ├── AuthGuard.tsx
│   │   │   ├── AuthGuard.spec.tsx
│   │   │   └── index.ts
│   │   └── SignInPage/
│   │       ├── SignInPage.tsx
│   │       ├── SignInPage.spec.tsx
│   │       └── index.ts
│   ├── hooks/                   # useLogin, useRegister, useAuth
│   ├── schemas/                 # register.schema.ts, login.schema.ts (zod schemas + inferred types)
│   ├── api.ts                   # all API calls for this feature
│   ├── types.ts                 # User, LoginPayload, RegisterPayload
│   └── utils.ts                 # token helpers, validation
└── bookings/
    ├── components/
    │   ├── BookingForm/
    │   │   ├── BookingForm.tsx
    │   │   ├── BookingForm.spec.tsx
    │   │   └── index.ts
    │   ├── BookingsList/        # related files (skeletons, etc.) live inside the folder
    │   │   ├── BookingsList.tsx
    │   │   ├── BookingSkeletons.tsx
    │   │   └── index.ts
    │   └── ...
    ├── hooks/                   # useBookings, useCreateBooking, useDeleteBooking
    ├── schemas/                 # booking.schema.ts
    ├── api.ts
    ├── types.ts
    └── utils.ts
```

### Component folder rules

- **One folder per component** — never flat `.tsx` files directly in `components/`
- Each folder contains: `ComponentName.tsx`, `ComponentName.spec.tsx`, `index.ts`
- Co-locate related files inside the same folder: skeletons, component-specific utils, sub-components only used by this component
- `index.ts` only re-exports — no logic:
  ```ts
  export { BookingsList } from "./BookingsList";
  export { BookingCardSkeleton, BookingListSkeleton } from "./BookingSkeletons";
  ```
- External imports resolve through `index.ts` via folder resolution:
  ```ts
  import { BookingsList } from "@/features/bookings/components/BookingsList";
  ```
- Cross-component imports use `../` (sibling folder):
  ```ts
  // inside BookingsList/BookingsList.tsx
  import { FeedItemCard } from "../FeedItemCard";
  import { EmptyState } from "../EmptyState";
  ```

---

## Rules Per Layer

### `app/` — Pages
- Thin wrappers only — no logic, no API calls, no state
- Import and render from `features/`
- Use route groups `(auth)`, `(dashboard)` to organize without affecting the URL

```tsx
// app/(dashboard)/notes/page.tsx
import { NoteList } from "@/features/notes/components/NoteList";

const NotesPage = (): JSX.Element => <NoteList />;

export default NotesPage;
```

---

### `features/` — Feature Logic
- Self-contained — components, hooks, API, types all collocated
- A feature can only import from `components/`, `hooks/`, `lib/`, `types/`, `utils/` — never from another feature directly
- If two features need the same thing, extract it to the shared layer

```tsx
// features/notes/components/NoteCard.tsx
import { Note } from "../types";

interface NoteCardProps {
  note: Note;
  onDelete: (id: number) => void;
}

export const NoteCard = ({ note, onDelete }: NoteCardProps): JSX.Element => { ... };
```

```ts
// features/notes/hooks/useNotes.ts
import { useQuery } from "@tanstack/react-query";
import { getNotes } from "../api";

export const useNotes = (categoryId?: number) =>
  useQuery({
    queryKey: ["notes", categoryId],
    queryFn: () => getNotes(categoryId),
  });
```

```ts
// features/notes/api.ts
import api from "@/lib/api";
import { Note, NotePayload } from "./types";

export const getNotes = (categoryId?: number) =>
  api.get<Note[]>("/notes/", { params: { category_id: categoryId } });

export const createNote = (payload: NotePayload) =>
  api.post<Note>("/notes/", payload);

export const deleteNote = (id: number) =>
  api.delete(`/notes/${id}/`);
```

---

### `components/` — Shared UI

Two sub-layers:

| Sub-layer | What goes here |
|---|---|
| `ui/` | shadcn/ui components — never modify these directly |
| `<ComponentName>/` | Custom app-wide components with their own logic/tests |

#### Available shadcn components (`components/ui/`)

| Component | Import | Key props / variants |
|---|---|---|
| `Button` | `@/components/ui/button` | `variant`: default, outline, ghost, secondary, destructive, link · `size`: default, sm, lg, icon |
| `Card` | `@/components/ui/card` | `Card`, `CardHeader`, `CardContent`, `CardFooter`, `CardTitle`, `CardDescription` |
| `Input` | `@/components/ui/input` | standard HTML input, styled |
| `Form` | `@/components/ui/form` | `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` — wraps react-hook-form |
| `Dialog` | `@/components/ui/dialog` | `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter` |
| `Badge` | `@/components/ui/badge` | `variant`: default, secondary, destructive, outline, ghost, link |
| `Label` | `@/components/ui/label` | standard label, styled |

**Before writing any UI, always check `components/ui/` first — never build a raw `<button>`, `<input>`, or `<dialog>` when a shadcn component exists.**

To add more shadcn components:
```sh
cd apps/web && pnpm dlx shadcn@latest add <component-name>
```

**Hard rules:**
- Never use hardcoded hex colors — use named Tailwind color utilities (`text-brown`, `bg-coral`, `text-teal/75`) or semantic tokens (`text-foreground`, `border-input`). Never write `text-[var(--color-*)]` — the short form works because the tokens are registered in `@theme inline` in `globals.css`.
- Never put custom components in `components/ui/` — shadcn only
- Nook color utilities: `brown`, `coral`, `cream`, `teal` — all support opacity modifier (e.g. `text-brown/75`)
- Font utilities: `font-quicksand` (headings + brand), `font-figtree` (body — rarely needed, `body` sets it globally). Never use `font-[family-name:var(--font-*)]`.

```tsx
// components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
}

export const Button = ({ variant = "primary", loading, children, ...props }: ButtonProps): JSX.Element => { ... };
```

---

### `lib/` — Third-Party Setup
- One file per library — setup and export only, no business logic
- Axios instance, React Query client, etc.

```ts
// lib/api.ts — axios instance with auth interceptors (tokens in localStorage)
// lib/query-client.ts — React Query client setup
```

---

## Route Protection

This project uses a two-layer pattern for client-side auth guards. Tokens live in `localStorage` — no cookies, no middleware.

### Layer 1 — `AuthProvider` (state)

`features/auth/context/AuthContext.tsx` reads `localStorage` via `useSyncExternalStore` (SSR-safe — no `useState` + `useEffect`). It broadcasts `{ token, isAuthenticated }` to the whole tree and is mounted once in `app/providers.tsx`. It has **zero routing knowledge**.

```tsx
// features/auth/context/AuthContext.tsx
"use client";
import { createContext, useMemo, useSyncExternalStore } from "react";

const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};
const getSnapshot = () => localStorage.getItem("access_token");
const getServerSnapshot = () => null;

export const AuthProvider = ({ children }) => {
  const token = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = useMemo(() => ({ token, isAuthenticated: token !== null }), [token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### Layer 2 — `AuthGuard` (enforcement)

`features/auth/components/AuthGuard.tsx` is the **only** `"use client"` file with redirect logic. It accepts `requireAuth: boolean`, blocks rendering synchronously, and fires `router.replace()` in `useEffect`.

```tsx
// features/auth/components/AuthGuard.tsx
"use client";
const AuthGuard = ({ children, requireAuth }) => {
  const { token } = useAuth();
  useEffect(() => {
    if (requireAuth && token === null) router.replace("/login");
    else if (!requireAuth && token !== null) router.replace("/dashboard/notes");
  }, [token, requireAuth, router]);

  if (requireAuth && token === null) return null;   // block + prevent flash
  if (!requireAuth && token !== null) return null;
  return <>{children}</>;
};
```

### Route group layouts (Server Components)

Layouts are thin Server Components — no hooks, no `"use client"`. They delegate the client boundary entirely to `AuthGuard`:

```tsx
// app/(dashboard)/layout.tsx — protects all dashboard routes
const DashboardLayout = ({ children }) => (
  <AuthGuard requireAuth>
    <div className="flex flex-1 flex-col">{children}</div>
  </AuthGuard>
);

// app/(auth)/layout.tsx — redirects logged-in users away from login/register
const AuthLayout = ({ children }) => (
  <AuthGuard requireAuth={false}>
    <div className="flex flex-1 flex-col items-center justify-center p-8">{children}</div>
  </AuthGuard>
);
```

**Rules:**
- Never add redirect logic inside a page component — `AuthGuard` via the layout handles it
- Never add auth logic to `AuthProvider` — it is a pure state provider
- `useAuth()` (`features/auth/hooks/useAuth.ts`) is the only way to read auth state in components

---

## Pagination & Infinite Scroll

All list endpoints return `{ data: T[], meta: { total, page, limit, totalPages } }`. On the frontend, lists use **`useInfiniteQuery`** + an **intersection observer sentinel** for infinite scroll — never manual "Load more" buttons.

### API function
```ts
// features/bookings/api.ts
export interface PageMeta { total: number; page: number; limit: number; totalPages: number; }
export interface PagedResponse<T> { data: T[]; meta: PageMeta; }

export const getBookings = (page = 1, limit = 20): Promise<PagedResponse<Booking>> =>
  api.get<PagedResponse<Booking>>('/bookings', { params: { page, limit } }).then(r => r.data);
```

### Hook
```ts
// features/bookings/hooks/useBookings.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { getBookings } from '../api';

export const useBookings = () =>
  useInfiniteQuery({
    queryKey: ['bookings'],
    queryFn: ({ pageParam = 1 }) => getBookings(pageParam),
    getNextPageParam: (last) => last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined,
    initialPageParam: 1,
  });
```

### Scroll sentinel (shared hook — `hooks/useIntersectionObserver.ts`)
```ts
import { useEffect, useRef } from 'react';

export const useIntersectionObserver = (onIntersect: () => void, enabled = true) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!enabled || !ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onIntersect();
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [enabled, onIntersect]);
  return ref;
};
```

### List component pattern
```tsx
const BookingsList = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useBookings();
  const sentinelRef = useIntersectionObserver(fetchNextPage, hasNextPage);

  const bookings = data?.pages.flatMap(p => p.data) ?? [];

  return (
    <>
      {bookings.map(b => <BookingCard key={b.id} booking={b} />)}
      <div ref={sentinelRef} className="h-4" />
      {isFetchingNextPage && <Skeleton />}
    </>
  );
};
```

**Rules:**
- Always use `useInfiniteQuery` for list endpoints — never `useQuery` with manual page state
- Flatten pages with `data?.pages.flatMap(p => p.data) ?? []`
- The sentinel `<div>` must be the last element in the scroll container

---

## Dependency Rules

Dependencies only flow **downward**. Features never import from other features.

```
app/           → features, components, lib
features/      → components, hooks, lib, types, utils
components/    → lib, types, utils
hooks/         → lib, types
lib/           → nothing internal
utils/         → nothing internal
types/         → nothing internal
```

If `notes` needs the current user → get it from `lib/auth` or a shared context, not from `features/auth`.

---

## Utils Extraction

Every feature folder has a `utils.ts`. Shared layout helpers live in `components/layout/utils.ts`. Shared user helpers live in `features/users/utils.ts`.

**Extract to `utils.ts` when:**

| Trigger | Rule |
|---|---|
| Pure function defined inside a component or hook file | Move it to `utils.ts` and import it |
| Same expression or function appears in 2+ files | Extract immediately — one source of truth |
| Same inline template or pattern used 3+ times in one file | Extract to a named helper |

**What belongs in utils:**
- Formatters: `formatTime`, `formatDuration`, `toLocalISODate`, `buildISODateTime`
- Date helpers: `getMondayOfWeek`, `getWeekDays`
- Display helpers: `getGreeting`, `getDateLabel`, `getUserInitial`
- Predicates: `isNavItemActive`

**What does NOT belong in utils:**
- Anything that calls a React hook — that belongs in `hooks/`
- Anything with side effects — that belongs in a service or hook
- One-liners used in exactly one place and obvious from context

**Where to put it:**

| Logic belongs to | File |
|---|---|
| A specific feature (bookings, auth, users…) | `features/<feature>/utils.ts` |
| Layout components (Sidebar, TopBar, BottomNav…) | `components/layout/utils.ts` |
| Shared across multiple features | `utils/` at the app root |

**Example:**
```ts
// ✗ defined inside BookingCard.tsx
const formatDuration = (start: string, end: string): string => { ... };

// ✓ in features/bookings/utils.ts, imported where needed
export const formatDuration = (start: string, end: string): string => { ... };
```

---

## Features

There is no fixed list of required features. Each feature is added as the product grows. When adding a new feature:

- Create a new folder under `features/<feature-name>/`
- Follow the internal structure: `components/`, `hooks/`, `api.ts`, `types.ts`, `utils.ts`
- Register its routes under `app/` as needed
- A feature may only import from shared layers (`components/`, `hooks/`, `lib/`, `types/`, `utils/`) — never from another feature directly

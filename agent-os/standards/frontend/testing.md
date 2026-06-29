# Frontend Testing

Vitest + React Testing Library + jsdom. Config: `vitest.config.ts` with `globals: true` and `setupFiles: ['./vitest.setup.ts']` (imports `@testing-library/jest-dom/vitest`).

## File Location

Colocate spec files next to the component:
```
features/bookings/components/
├── BookingCard.tsx
└── BookingCard.spec.tsx
```

## Test Wrapper

Wrap renders in a `QueryClientProvider` with a fresh client per test:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

it('renders booking title', () => {
  render(<BookingCard booking={mockBooking} />, { wrapper: createWrapper() });
  expect(screen.getByText('Team standup')).toBeInTheDocument();
});
```

- Set `retry: false` so failed queries don't hang tests
- Create a fresh `QueryClient` per test to avoid state leakage

## Commands

```sh
pnpm --filter=web test        # watch mode
pnpm --filter=web test:run    # single run
pnpm --filter=web test:coverage
```

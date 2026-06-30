# FE-4.3 — Responsive Polish + Accessibility Pass

## Scope

Accessibility audit and fixes. Most items were already complete from prior work. Three gaps remain:
1. BottomNav active tab missing `aria-current="page"`
2. FeedItemCard edit/cancel aria-labels are generic ("Edit booking") instead of title-specific
3. CalendarEventBlock booking div has no keyboard support (role, tabIndex, onKeyDown)

## Decisions

- Use `aria-current="page"` (not `"true"`) — correct ARIA value for navigation landmarks
- Include booking title in aria-labels: `"Edit {title}"` / `"Cancel {title}"` — specific enough for screen readers to differentiate items in a list
- CalendarEventBlock keyboard handler: Enter and Space both trigger click — matches ARIA button pattern

## Context

- **Visuals:** None
- **References:** Existing `BottomNav.tsx`, `FeedItemCard.tsx`, `CalendarEventBlock.tsx`
- **Product alignment:** Phase 4 Polish & Quality

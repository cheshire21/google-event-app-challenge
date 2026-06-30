# References for FE-4.3

## Already-correct examples in the codebase

### FAB.tsx
- **Location:** `apps/web/components/layout/FAB.tsx`
- **Pattern:** Icon-only button with `aria-label="New booking"` — reference for other icon buttons

### WeekNavigator.tsx
- **Location:** `apps/web/features/calendar/components/WeekNavigator.tsx`
- **Pattern:** `aria-label="Previous week"` / `"Next week"` on icon buttons — already correct

### BottomNav logout button
- **Location:** `apps/web/components/layout/BottomNav.tsx` line 47
- **Pattern:** `aria-label="Log out"` on icon button — correct; nav Links just need `aria-current`

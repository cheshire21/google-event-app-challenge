# Standards for FE-4.3

## frontend/accessibility

- Every interactive element must have an accessible name (via text content, aria-label, or aria-labelledby)
- Icon-only buttons MUST have `aria-label`
- Active nav items in a navigation landmark MUST have `aria-current="page"`
- Custom interactive divs (not button/a) MUST have `role="button"`, `tabIndex={0}`, and `onKeyDown` handling Enter and Space
- Never use `aria-label` to duplicate visible text — only use it to add context (e.g. include title in button labels for lists)

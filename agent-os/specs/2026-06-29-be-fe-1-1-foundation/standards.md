# Standards for BE-1.1 + FE-1.1

No formal standards are defined in `agent-os/standards/` yet. The following conventions apply based on the tech stack and Tailwind v4 approach.

---

## Tailwind v4 CSS-Based Theming

Tailwind v4 removes `tailwind.config.ts`. All customization is done in CSS:

```css
/* 1. Define raw values in :root */
:root {
  --color-coral: #E8694A;
}

/* 2. Expose to Tailwind's utility system via @theme inline */
@theme inline {
  --color-coral: var(--color-coral);
}
```

This generates `bg-coral`, `text-coral`, `border-coral`, `ring-coral`, etc.

## Prisma Conventions

- UUIDs for all primary keys (`@id @default(uuid())`)
- `createdAt` / `updatedAt` on all models
- Cascade delete on child relations (`onDelete: Cascade`)
- Field order: id → foreign keys → business fields → timestamps

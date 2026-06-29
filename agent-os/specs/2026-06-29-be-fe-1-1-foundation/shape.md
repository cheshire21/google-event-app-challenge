# BE-1.1 + FE-1.1 — Shaping Notes

## Scope

Two parallel Phase 1 tasks:
- **BE-1.1**: Add `User` and `Booking` Prisma models; run initial migration
- **FE-1.1**: Install 6 frontend packages; wire up Tailwind v4 design tokens + Nook fonts

## Decisions

- Tailwind v4 uses CSS-based config (no tailwind.config.ts). Colors go in `:root` and `@theme inline` to generate utilities (`bg-coral`, `text-teal`, etc.)
- Existing oklch semantic tokens (`--background`, `--primary`, `--foreground`) are remapped to point at Nook CSS variables — avoids breaking any future shadcn components
- Geist font files removed; replaced with `next/font/google` (Quicksand + Figtree)
- Material Symbols Rounded loaded via Google Fonts `<link>` (not next/font — icon fonts aren't supported)
- No test files required for either task per the development plan

## Context

- **Visuals:** `Nook Design/` folder — HTML design system, interactive prototype, and screenshots
- **References:** No existing feature modules; starting from boilerplate
- **Product alignment:** Phase 1 foundation — all subsequent phases depend on these being correct

## Standards Applied

- None formally defined yet (standards/index.yml is empty)
- Tailwind v4 CSS-in-CSS theming approach documented here as the de-facto standard

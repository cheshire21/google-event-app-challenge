# Tailwind v4 Design Tokens

No `tailwind.config.ts`. All theming lives in `app/globals.css`.

## Nook Color Palette

| Token | Hex | Utility classes |
|---|---|---|
| `--color-cream` | `#FAF7F2` | `bg-cream`, `text-cream` |
| `--color-coral` | `#E8694A` | `bg-coral`, `text-coral` |
| `--color-teal` | `#38B2AC` | `bg-teal`, `text-teal` |
| `--color-brown` | `#3D2C2C` | `bg-brown`, `text-brown` |

Coral = primary actions. Teal = Google Calendar events. Cream = page background. Brown = body text.

## Adding a New Token

Always define in CSS variables — never use arbitrary `bg-[#hex]` values.

```css
/* 1. Add to :root */
:root {
  --color-amber: #F59E0B;
}

/* 2. Expose in @theme inline */
@theme inline {
  --color-amber: var(--color-amber);
}
```

This generates `bg-amber`, `text-amber`, `border-amber`, etc.

## Semantic Tokens

Semantic tokens (`--background`, `--primary`, `--foreground`) point at Nook palette vars:
- `--background` → `var(--color-cream)`
- `--primary` → `var(--color-coral)`
- `--foreground` → `var(--color-brown)`

Use semantic tokens (`bg-background`, `text-foreground`) for structural elements; use Nook palette tokens (`bg-coral`, `text-teal`) for branded UI.

## Typography Utilities

Defined in `@layer components` in `globals.css`:
- `.page-heading` — Quicksand 700, 1.5rem
- `.card-title` — Figtree 600, 1rem
- `.body-text` — Figtree 400, 0.875rem

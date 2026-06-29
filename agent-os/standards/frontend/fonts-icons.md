# Fonts & Icons

Verified against `Nook Design/README.md`.

## Fonts

| Font | Use | Weights | CSS variable |
|---|---|---|---|
| Quicksand | Brand / logo / headings | 600, 700 | `--font-quicksand` |
| Figtree | UI body text, labels, inputs | 400, 500, 600 | `--font-figtree` |

Loaded via `next/font/google` in `app/layout.tsx`. Applied as CSS variables on `<body>`:

```tsx
const quicksand = Quicksand({ subsets: ['latin'], variable: '--font-quicksand', weight: ['600', '700'] })
const figtree   = Figtree({ subsets: ['latin'], variable: '--font-figtree', weight: ['400', '500', '600'] })

<body className={`${figtree.variable} ${quicksand.variable}`}>
```

Use in CSS via `font-family: var(--font-figtree)` or the `.page-heading` / `.card-title` / `.body-text` utility classes.

## Icons

Material Symbols Rounded only. Loaded via `<link>` tag in `app/layout.tsx` `<head>`:

```tsx
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link
  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional"
  rel="stylesheet"
/>
```

Usage in JSX:
```tsx
<span className="material-symbols-rounded">calendar_today</span>
```

- `lucide-react` is also available for cases where a specific icon isn't in Material Symbols
- Do not use both icon sets for the same visual concept

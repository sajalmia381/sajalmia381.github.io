# TailwindCSS Rules

Version: TailwindCSS 4.x (`@tailwindcss/cli ^4.3.0`, `@tailwindcss/postcss ^4.3.0`)

## Build pipeline

Tailwind is compiled as a **separate CLI step** before Angular builds:

```
src/tailwind.css  →  (tailwindcss CLI)  →  src/tailwind.generated.css
```

`tailwind.generated.css` is listed first in `angular.json` styles. Never edit it — it is regenerated on every build.

```bash
npm run tailwind        # one-shot compile
npm run tailwind:watch  # watch mode during dev
npm start               # runs tailwind then ng serve
npm run build           # runs tailwind then ng build
```

`postcss.config.js` at the root enables `@tailwindcss/postcss` for any PostCSS pipeline.

## Configuration — CSS-first (`src/tailwind.css`)

All design tokens live in `src/tailwind.css`. There is **no `tailwind.config.js`**.

```css
@import "tailwindcss";

/* Scan all Angular source files for class names */
@source ".";

/* Class-based dark mode */
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* Breakpoints */
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --breakpoint-2xl: initial;   /* removes v4 default 1536px */
  --breakpoint-xxl: 1440px;

  /* Colors */
  --color-primary: #2dd4bf;
  --color-accent:  #420fe7;
  --color-warn:    #ff9966;
  --color-light:   #f3f2f4;

  /* Spacing */
  --spacing-page:     1rem;
  --spacing-page-xxl: 1.25rem;
}

/* Container — replicates v3 container plugin behaviour */
@layer components {
  .container {
    width: 100%;
    margin-inline: auto;
    padding-inline: 15px;
  }

  @media (min-width: 576px) {
    .container { padding-inline: 30px; }
  }
}

/* Global @apply rules must live here, not in component SCSS files */
body {
  @apply bg-gray-900 text-slate-300;
}
```

Reference tokens in templates: `bg-primary`, `text-accent`, `p-page`, `p-page-xxl`.

## Dark mode

Dark mode is toggled by adding the `dark` class to an ancestor element. The custom variant covers all descendants:

```html
<div class="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
```

## Utility-first

- Apply styles exclusively via utility classes in the template
- **No inline `style="..."`** — zero exceptions
- **No `@apply`** in component SCSS files — only allowed in `src/tailwind.css`

```html
<!-- ✓ -->
<div class="flex items-center gap-4 rounded-lg bg-light p-page shadow-sm">
  <span class="text-sm font-medium text-primary">Label</span>
</div>

<!-- ✗ -->
<div style="display: flex; gap: 1rem;">...</div>
```

## Responsive design

Mobile-first. Breakpoints match Bootstrap-style values defined in `@theme`. Use the `xxl:` prefix for 1440px+:

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xxl:grid-cols-4 gap-6">
```

## Angular Material integration

Layer Tailwind utilities on top of Material components for spacing, layout, and colour. Do not override Material baseline CSS — use `mat-` tokens for theming.

```html
<mat-card class="p-6 shadow-md rounded-xl">
  <mat-card-header class="mb-4">
    <mat-card-title class="text-lg font-semibold text-primary">Title</mat-card-title>
  </mat-card-header>
</mat-card>
```

## Do not

- Do not create `tailwind.config.js` — configuration is CSS-only in `src/tailwind.css`
- Do not edit `src/tailwind.generated.css` — it is auto-generated
- Do not add `@apply` in component `.scss` files — use utility classes in the template instead
- Do not use arbitrary values (`w-[347px]`) when a token or standard scale value fits
- Do not install `@tailwindcss/typography` or `@tailwindcss/forms` unless explicitly needed
- Do not prefix every class with `!` (important modifier) to fight specificity — fix the specificity instead

# Upgrade TailwindCSS 3 → 4

**Date:** 2026-05-10  
**Status:** Complete

---

## Context

The project used TailwindCSS 3.3.5 with a `tailwind.config.js`. TailwindCSS v4 drops the JS config file in favour of a CSS-first model: all design tokens live in `@theme {}` inside a plain CSS file, and `@tailwindcss/postcss` replaces the old PostCSS plugin.

### Key discovery: Angular 18 esbuild builder does NOT run PostCSS on plain CSS files

Angular 18's `@angular-devkit/build-angular:application` builder uses esbuild. esbuild resolves `@import "tailwindcss"` by inlining CSS from `node_modules/tailwindcss/` directly — it **bypasses `postcss.config.js` entirely** for plain `.css` global style entries. A `postcss.config.js` file has no effect for this use case.

**Solution:** Use `@tailwindcss/cli` as a pre-build step. The CLI processes `src/tailwind.css` → outputs `src/tailwind.generated.css` (fully resolved, no Tailwind directives). Angular includes the generated file as a regular static CSS asset.

**SCSS complication:** Component SCSS files are compiled by Angular's Sass compiler, not Tailwind CLI. This means:
- `@apply` in component SCSS files → must be replaced with direct CSS (custom properties, plain values)
- `@screen sm` in component SCSS files → must be replaced with `@media (min-width: 576px)`
- All SCSS-specific syntax (`&` nesting, variables) continues to work unchanged

---

## Files Changed

| File | Action |
|------|--------|
| `package.json` | Remove `tailwindcss@3`, `autoprefixer`; add `tailwindcss@^4`, `@tailwindcss/postcss@^4`, `@tailwindcss/cli@^4`; update scripts |
| `tailwind.config.js` | **Deleted** |
| `postcss.config.js` | Created (CJS) — present but unused by Angular's esbuild builder; kept for reference |
| `src/tailwind.css` | **Created** — Tailwind v4 source with `@theme`, `@custom-variant`, `@layer components` |
| `src/tailwind.generated.css` | **Generated** (git-ignored) — output of Tailwind CLI, included by Angular |
| `src/styles.scss` | Removed `@tailwind` directives and any `@apply` blocks from global styles |
| `angular.json` | Both `build` and `test` styles arrays use `src/tailwind.generated.css` (not `src/tailwind.css`) |
| `.gitignore` | Added `/src/tailwind.generated.css` |
| `src/app/home/components/experience/experience.component.scss` | Replaced `@apply` with CSS custom properties |
| `src/app/home/components/hero/hero.component.scss` | Replaced `@apply bg-primary` with `background-color: var(--color-primary)` |
| `src/app/home/components/toolbar/toolbar.component.scss` | Replaced `@apply` with CSS custom properties |
| `src/app/home/components/skill/skill.component.scss` | Replaced `@screen sm/lg` with `@media (min-width: 576px/992px)` |

---

## `package.json` scripts

```json
"tailwind": "tailwindcss -i src/tailwind.css -o src/tailwind.generated.css",
"tailwind:watch": "tailwindcss -i src/tailwind.css -o src/tailwind.generated.css --watch",
"start": "npm run tailwind && ng serve --port 4400",
"build": "npm run tailwind && ng build --output-path docs --base-href /",
```

During active development, run `npm run tailwind:watch` in a parallel terminal alongside `ng serve`.

---

## `src/tailwind.css` (source — processed by CLI)

```css
@import "tailwindcss";

@source ".";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --breakpoint-2xl: initial;
  --breakpoint-xxl: 1440px;

  --color-primary: #2dd4bf;
  --color-accent: #420fe7;
  --color-warn: #ff9966;
  --color-light: #f3f2f4;

  --spacing-page: 1rem;
  --spacing-page-xxl: 1.25rem;
}

@layer components {
  .container {
    width: 100%;
    margin-inline: auto;
    padding-inline: 15px;
  }

  @media (min-width: 576px) {
    .container {
      padding-inline: 30px;
    }
  }
}

body {
  @apply bg-gray-900 text-slate-300;
}

.bg-theme-2 {
  @apply bg-teal-400/40;
}
```

---

## Replacing `@apply` in component SCSS

Since component SCSS files are NOT processed by the Tailwind CLI, `@apply` and `@screen` must be replaced:

| v3 SCSS | v4 replacement |
|---------|---------------|
| `@apply bg-primary` | `background-color: var(--color-primary)` |
| `@apply text-primary` | `color: var(--color-primary)` |
| `@apply fill-primary` | `fill: var(--color-primary)` |
| `@apply bg-gray-900` | `background-color: var(--color-gray-900)` |
| `@apply border-gray-500` | `border-color: var(--color-gray-500)` |
| `@apply bg-teal-400/40` | `background-color: color-mix(in oklab, var(--color-teal-400) 40%, transparent)` |
| `@apply text-teal-300` | `color: var(--color-teal-300)` |
| `@apply rounded-full` | `border-radius: 9999px` |
| `@screen sm { ... }` | `@media (min-width: 576px) { ... }` |
| `@screen lg { ... }` | `@media (min-width: 992px) { ... }` |

---

## Breaking changes from v3

| v3 feature | v4 outcome |
|-----------|-----------|
| `tailwind.config.js` | Deleted — tokens moved to `@theme {}` in `tailwind.css` |
| `important: ':root'` | Dropped — use `!` modifier if specificity conflicts arise |
| `darkMode: 'class'` | Replaced by `@custom-variant dark` — same `.dark` class trigger |
| `theme.screens` | Preserved via `--breakpoint-*` in `@theme` |
| `autoprefixer` | Removed — v4 bundles it |
| `@screen` in SCSS | Must use `@media (min-width: ...)` directly |
| `@apply` in component SCSS | Must use CSS custom properties or plain CSS values |

---

## Known warnings (non-blocking)

```
1 rules skipped due to selector errors: .rtl\:space-x-reverse:where(:dir(rtl),...) -> Unknown pseudo-class :dir
```

This is a known esbuild warning from Tailwind v4's RTL utilities. Does not affect output.

---

## Verification checklist

- [ ] `npm run tailwind` runs without errors, generates `src/tailwind.generated.css`
- [ ] `npm start` — dev server starts on http://localhost:4400
- [ ] Dark background (`bg-gray-900`) visible on body
- [ ] Teal primary colour (`#2dd4bf`) visible in hero and experience section
- [ ] Toolbar sticks with dark background and border
- [ ] Skill grid: 1 col mobile → 2 col ≥576px → 3 col ≥992px
- [ ] `npm run build` — production build outputs to `docs/` with no errors

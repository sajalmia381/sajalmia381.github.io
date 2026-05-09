# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Compile Tailwind then serve on http://localhost:4400
npm run build      # Compile Tailwind then produce production build → docs/
npm test           # Run unit tests via Karma/Jasmine
npm run prettier   # Format all source files
npm run tailwind   # One-shot Tailwind compile (src/tailwind.css → src/tailwind.generated.css)
npm run tailwind:watch  # Watch mode for Tailwind during development
```

To run a single test file:
```bash
npx ng test --include='src/app/home/home.component.spec.ts'
```

## Architecture

Angular 18 single-page portfolio/resume app deployed to GitHub Pages. Build output goes to `docs/` (not the default `dist/`), which GitHub Pages serves from the `master` branch.

### NgModule vs standalone

**Existing code uses NgModule architecture** — `AppModule`, `HomeModule`, and all component `declarations[]`. The `.claude/rules/angular.md` mandates standalone components for any new work. When adding new components, follow the standalone pattern (no NgModule); when editing existing components, leave the NgModule registration in place.

### Data flow pattern

Each feature uses a three-layer pattern:

- **API** (`home.api.ts`) — raw HTTP calls; constructs URLs from `API_BASE_URL` injected via `APP_ENV` token
- **State** (`home.state.ts`) — `BehaviorSubject`-backed observables; acts as a simple in-memory store
- **Facade** (`home.facade.ts`) — the only class components talk to; coordinates API + State and exposes plain observables

Components never call `HomeApi` or `HomeState` directly.

### Path aliases (tsconfig.json)

| Alias | Resolves to |
|---|---|
| `@package/*` | `src/app/package/*` |
| `@shared/*` | `src/app/shared/*` |

`@package` holds the `APP_ENV` injection token and `IEnv` interface. `@shared` holds the animations library (`@shared/animations`) and `ScrollService` (`@shared/services/scroll.service`).

### External data

Blog posts and portfolio items are fetched from the WordPress REST API at `https://techincent.com/wp-json/wp`. The base URL flows from `environment.ts` → `APP_ENV` injection token → `HomeApi`. Endpoints: `v2/posts` and `v2/portfolio`, sliced to 6 items each in the facade.

### Tailwind

Tailwind is compiled as a **separate CLI step before Angular builds** — `src/tailwind.css` → `src/tailwind.generated.css`. `npm start` and `npm run build` run this automatically. Never edit `tailwind.generated.css`. All design tokens (`--color-primary`, breakpoints, spacing) live in `src/tailwind.css` — there is no `tailwind.config.js`.

### Animations

`src/app/shared/animations/` is a custom animate.css-inspired library of Angular `AnimationReferenceMetadata` factories (fade, zoom, bounce, rotate, slide categories). Import named factories from `@shared/animations` and register them in a component's `animations: []` metadata array with an `anchor` string.

### Component selector prefix

All components use the `mia-` prefix (configured in `angular.json`).

### Formatting

Prettier is enforced via husky pre-commit hook (lint-staged). Config is in `prettier.config.js`: 140-char print width, double quotes, trailing commas (ES5).

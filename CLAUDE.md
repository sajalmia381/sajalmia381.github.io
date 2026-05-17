# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Serve on http://localhost:4400 (Tailwind compiled by Angular via PostCSS)
npm run build      # Produce production build → docs/ (Tailwind compiled by Angular via PostCSS)
npm test           # Run unit tests via Karma/Jasmine
npm run prettier   # Format all source files
```

To run a single test file:
```bash
npx ng test --include='src/app/home/home.component.spec.ts'
```

## Architecture

Angular 18 + Angular Material 18 single-page portfolio/resume app deployed to GitHub Pages. Build output goes to `docs/` (not the default `dist/`), which GitHub Pages serves from the `master` branch.

### NgModule vs standalone

**Existing code uses NgModule architecture** — `AppModule`, `HomeModule`, and all component `declarations[]`. The `.claude/rules/angular.md` mandates standalone components for any new work. When adding new components, follow the standalone pattern (no NgModule); when editing existing components, leave the NgModule registration in place.

### Home page structure

`HomeComponent` renders eight sections in order: `mia-toolbar`, `mia-hero`, `mia-experience`, `mia-skill`, `mia-portfolio`, `mia-blog`, `mia-contact`, `mia-footer`.

**Static sections** (hardcoded data in templates/components): toolbar, hero, experience, skill, contact, footer.

**API-driven sections** (data fetched at runtime): portfolio and blog — both subscribe to `HomeFacade` observables.

### Data flow pattern

Each feature uses a three-layer pattern:

- **API** (`home.api.ts`) — raw HTTP calls; constructs URLs from `API_BASE_URL` injected via `APP_ENV` token
- **State** (`home.state.ts`) — `BehaviorSubject`-backed observables; acts as a simple in-memory store
- **Facade** (`home.facade.ts`) — the only class components talk to; coordinates API + State and exposes plain observables

Components never call `HomeApi` or `HomeState` directly.

### Data models

TypeScript interfaces live in `src/app/home/modals/` (directory is named `modals`, not `models` — a historical quirk). The barrel export is `modals/index.ts`.

### Path aliases (tsconfig.json)

| Alias | Resolves to |
|---|---|
| `@package/*` | `src/app/package/*` |
| `@shared/*` | `src/app/shared/*` |

`@package` holds the `APP_ENV` injection token and `IEnv` interface. `@shared` holds the animations library (`@shared/animations`) and `ScrollService` (`@shared/services/scroll.service`).

### External data

Blog posts and portfolio items are fetched from the WordPress REST API at `https://techincent.com/wp-json/wp`. The base URL flows from `environment.ts` → `APP_ENV` injection token → `HomeApi`. Endpoints: `v2/posts` and `v2/portfolio`, sliced to 6 items each in the facade.

Both dev and production environments point to the same live API — there is no mock/local API.

### Scroll-triggered animations

`ScrollService` tracks the current scroll position. Components that animate on scroll extend the base class in `src/app/shared/models/scroll.component.ts`, which reads from `ScrollService` and exposes a boolean for triggering the Angular animation. `HomeComponent` listens to `(window:scroll)` and updates `ScrollService`.

### Tailwind

Tailwind is compiled **by Angular's build pipeline via PostCSS** (`@tailwindcss/postcss` in `.postcssrc.json`). `src/tailwind.scss` is referenced directly in `angular.json` styles — no separate compile step. All design tokens (`--color-primary`, breakpoints, spacing) live in `src/tailwind.scss` — there is no `tailwind.config.js`.

### Animations

`src/app/shared/animations/` is a custom animate.css-inspired library of Angular `AnimationReferenceMetadata` factories organized into categories: fading, bouncing, zooming, rotating, sliding, flippers, light-speed, attention-seekers, specials. Import named factories from `@shared/animations` and register them in a component's `animations: []` metadata array with an `anchor` string.

### Angular Material

Angular Material 18 components are used for UI primitives. Import individual Material modules in each component's `imports` array. Use Material typography and the colour system; layer Tailwind utilities on top for spacing and layout — do not override Material baseline CSS.

### Component selector prefix

All components use the `mia-` prefix (configured in `angular.json`).

### Formatting

Prettier is enforced via husky pre-commit hook (lint-staged). Config is in `prettier.config.js`: 140-char print width, double quotes, trailing commas (ES5).

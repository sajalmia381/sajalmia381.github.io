# AGENTS.md

This file provides guidance to GitHub Copilot agents and OpenAI Codex when working with code in this repository.

## Commands

```bash
npm start          # Dev server on http://localhost:4400
npm run build      # Production build → docs/ (for GitHub Pages)
npm test           # Run unit tests via Karma/Jasmine
npm run prettier   # Format all source files
```

To run a single test file, pass the `--include` flag directly through the Angular CLI:
```bash
npx ng test --include='src/app/home/home.component.spec.ts'
```

## Architecture

This is a single-page Angular 18 portfolio/resume app deployed to GitHub Pages. The build output goes to `docs/` (not the default `dist/`), which is what GitHub Pages serves from the `master` branch.

### Data flow pattern

Each feature uses a three-layer pattern:

- **API** (`home.api.ts`) — raw HTTP calls, constructs URLs from `API_BASE_URL` injected via `APP_ENV` token
- **State** (`home.state.ts`) — `BehaviorSubject`-backed observables; acts as a simple in-memory store
- **Facade** (`home.facade.ts`) — the only class components talk to; coordinates API + State and exposes plain observables

Components never call `HomeApi` or `HomeState` directly.

### Path aliases (tsconfig.json)

| Alias | Resolves to |
|---|---|
| `@package/*` | `src/app/package/*` |
| `@shared/*` | `src/app/shared/*` |

`@package` holds the `APP_ENV` injection token and `IEnv` interface. `@shared` holds the animations library and `ScrollService`.

### External data

Blog posts and portfolio items are fetched from a WordPress REST API. The base URL comes from `environment.ts` → `APP_ENV` injection token → `HomeApi`. Endpoints are `v2/posts` and `v2/portfolio`, limited to 6 items each.

### Animations

`src/app/shared/animations/` is a custom animate.css-inspired library of Angular `AnimationReferenceMetadata` factories (fade, zoom, bounce, rotate, slide categories). Import named factories from `@shared/animations` and register them in a component's `animations: []` metadata array with an `anchor` string.

### Component selector prefix

All components use the `mia-` prefix (configured in `angular.json`).

### Formatting

Prettier is enforced via husky pre-commit hook (lint-staged). Config is in `prettier.config.js`: 140-char print width, double quotes, trailing commas (ES5).

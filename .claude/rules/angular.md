# Angular Rules

Version: Angular 21.1 + Angular Material 21.x

## Components

- **Standalone components only** — no NgModules
- `changeDetection: ChangeDetectionStrategy.OnPush` and `standalone: true` is default no need to specify it
- Use `inject()` for dependency injection — never constructor DI

```ts
// ✓
@Component({
  selector: 'np-document-list',
  imports: [MatTableModule, AsyncPipe],
  template: `...`,
})
export class DocumentListComponent {
  private readonly docService = inject(DocumentService);
}

// ✗ — constructor DI, no OnPush, not standalone
@Component({ selector: 'np-doc' })
export class DocComponent {
  constructor(private docService: DocumentService) {}
}
```

## State management

- `signal()` for local mutable state
- `computed()` for derived values — never re-derive in the template
- `effect()` only for side-effects (logging, localStorage sync); never for state derivation
- `toSignal()` to bridge Observables at the boundary

```ts
readonly docs = signal<Document[]>([]);
readonly count = computed(() => this.docs().length);
```

## Routing & guards

- Functional guards (`CanActivateFn`) — no class-based guards
- Lazy-load every feature route with `loadComponent` / `loadChildren`

```ts
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  return auth.isLoggedIn() ? true : inject(Router).createUrlTree(['/login']);
};
```

## Templates

- Prefer `@if`, `@for`, `@switch` (Angular 17+ block syntax) over `*ngIf`, `*ngFor`
- Avoid logic in templates beyond simple signal reads and boolean checks
- Use `===` in template expressions for role/status checks

```html
@if (user().role === UserRole.Admin) {
<app-admin-panel />
}
```

## Angular Material

- Use Angular Material 21.x components for all UI primitives (buttons, inputs, tables, dialogs)
- Import individual Material modules in the component's `imports` array
- Use Material typography and colour system; do not override with raw CSS

## HTTP

- `HttpClient` via `inject(HttpClient)` inside a service
- Return typed `Observable<T>` from service methods
- Handle errors in the service layer or via `catchError` in the component pipe

## Forms

- Reactive forms (`FormBuilder` via `inject(FormBuilder)`) for any form with validation
- Template-driven forms only for trivial read-only forms

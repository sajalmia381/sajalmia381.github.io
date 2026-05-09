# TypeScript Rules

## Compiler settings

- `"strict": true` in every `tsconfig.json` — non-negotiable
- `"noUncheckedIndexedAccess": true` where supported
- `"exactOptionalPropertyTypes": true`

## Equality

**Always `===` and `!==`.** Never `==` or `!=`. No exceptions.

```ts
// ✓
if (status === 'active') { ... }
if (count !== 0) { ... }

// ✗
if (status == 'active') { ... }
```

## Variables

- `const` by default; `let` only when reassignment is necessary; never `var`
- Destructure when accessing multiple properties of the same object

```ts
// ✓
const { id, name, role } = user;

// ✗
var id = user.id;
let name = user.name;
```

## Types

- No `any` without an explicit `// TODO: type this` comment on the same line
- Prefer `unknown` over `any` for truly unknown values — narrow with type guards
- Explicit return types on all public functions and methods
- Use `type` for unions/intersections, `interface` for object shapes that may be extended

```ts
// ✓
function getUser(id: string): Promise<User> { ... }

// ✗
function getUser(id: string) { ... }   // missing return type
```

## Async

- Always `async/await` — never raw `.then()/.catch()` chains
- `Promise.all()` for independent parallel operations

```ts
// ✓
const [user, docs] = await Promise.all([fetchUser(id), fetchDocs(id)]);

// ✗
fetchUser(id).then(user => fetchDocs(id).then(docs => ...));
```

## Imports

- Named imports preferred over default imports (tree-shakeable)
- Group: external libs → internal paths → relative paths (separated by blank lines)
- No barrel re-exports that pull in heavy transitive deps

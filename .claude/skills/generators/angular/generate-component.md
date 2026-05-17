# Skill: Generate Angular Component

Generate a production-ready Angular 21.1 standalone component following project conventions.

## Usage

Invoke this skill with:

```
/project:generate-component <ComponentName> [description of what it does]
```

## Prompt template

```
Generate an Angular 21.1 standalone component named `{ComponentName}`.

Requirements:
- Standalone component (no NgModule)
- Use inject() for all dependency injection — no constructor DI
- Use signal() for local mutable state, computed() for derived values
- Use Angular Material 21.x for UI primitives (import only the modules needed)
- Style with TailwindCSS 4.x utility classes — no inline styles, no @apply in the component
- Use @if / @for / @switch block syntax (not *ngIf / *ngFor)
- Expose UserRole to the template if role-based visibility is needed
- Explicit return types on all methods
- No any types

Component purpose: {description}

Output:
1. The component file ({component-name}.component.ts)
2. The component template inline or in a separate .html file
3. A brief usage example showing how to add it to a route or parent component
```

## Example output shape

```ts
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { DocumentService } from '../services/document.service';
import { UserRole } from '../shared/types/roles';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'np-document-list',
  imports: [MatButtonModule, MatTableModule],
  template: `
    <div class="p-6 space-y-4">
      <h2 class="text-xl font-semibold">Documents ({{ count() }})</h2>
      @if (user().role === UserRole.Admin) {
        <button mat-flat-button color="primary" (click)="upload()">Upload</button>
      }
      <mat-table [dataSource]="docs()">
        <!-- columns -->
      </mat-table>
    </div>
  `,
})
export class DocumentListComponent {
  private readonly docService = inject(DocumentService);
  private readonly auth = inject(AuthService);

  protected readonly UserRole = UserRole;
  protected readonly user = this.auth.currentUser;
  protected readonly docs = signal<Document[]>([]);
  protected readonly count = computed(() => this.docs().length);

  protected upload(): void {
    // ...
  }
}
```

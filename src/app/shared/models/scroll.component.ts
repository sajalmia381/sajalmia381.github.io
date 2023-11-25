import { ElementRef, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ScrollService } from "@shared/services/scroll.service";

export class ScrollComponent {
  protected el = inject(ElementRef);

  // Window Scroll Data
  private scrollService = inject(ScrollService);
  protected scrollData$ = this.scrollService.scrollData$.pipe(takeUntilDestroyed());
  protected scrollBottomPosition$ = this.scrollService.scrollBottomPosition$.pipe(takeUntilDestroyed());
}

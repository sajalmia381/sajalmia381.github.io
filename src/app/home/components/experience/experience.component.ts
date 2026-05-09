import { Component, inject } from "@angular/core";
import { ScrollService } from "@shared/services/scroll.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  standalone: false,
  selector: "mia-experience",
  templateUrl: "./experience.component.html",
  styleUrls: ["./experience.component.scss"],
})
export class ExperienceComponent {
  private scrollService = inject(ScrollService);
  scrollBottomPosition$ = this.scrollService.scrollBottomPosition$.pipe(takeUntilDestroyed());
}

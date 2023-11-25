import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, inject } from "@angular/core";
import { fadeInLeftAnimation, fadeInRightAnimation } from "@shared/animations";
import { Observable, distinctUntilChanged, map } from "rxjs";

@Component({
  selector: "mia-experience-item",
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="experience_period" [@fadeInLeft]="animationState">
      <ng-content select="[period]"></ng-content>
    </div>
    <div class="experience_content" [@fadeInRight]="animationState">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    class: "experience_item",
    "[class.opacity-0]": `animationState === 0`,
  },
  animations: [
    fadeInLeftAnimation({ anchor: "fadeInLeft", translate: "150px", duration: 800 }),
    fadeInRightAnimation({ anchor: "fadeInRight", translate: "150px", duration: 800 }),
  ],
})
export class ExperienceItemComponent implements OnInit {
  private el = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  @Input() scrollPosition$!: Observable<number>;

  animationState = 0;

  ngOnInit(): void {
    this.scrollPosition$
      .pipe(
        map((scrollPosition: number) => {
          return scrollPosition - 80 >= this.el.nativeElement.offsetTop;
        }),
        distinctUntilChanged()
      )
      .subscribe((visible: boolean) => {
        this.animationState = visible ? 1 : 0;
        this.cdr.detectChanges();
      });
  }
}

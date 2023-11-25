import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { ISkill } from "./skill.component";
import { ScrollComponent } from "@shared/models/scroll.component";
import { AnimationTriggerMetadata, animate, state, style, transition, trigger } from "@angular/animations";
import { distinctUntilChanged, map } from "rxjs/operators";

export function progressAnimation(): AnimationTriggerMetadata {
  return trigger('progress', [
    state('1', style({ width: "{{ width }}" }), { params: { width: '100%'}}),
    state('0', style({ width: '0px' })),
    transition('0 <=> 1', animate(500))
  ])
}

@Component({
  selector: 'mia-progress-bar',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="mb-1 text-lg font-medium dark:text-white">{{ data.name }}</div>
    <div class="w-full bg-gray-200 rounded-full h-2 mb-4 dark:bg-gray-700">
      <div  class="h-2 rounded-full" [ngClass]="data.progressBarColor || 'bg-green-400'" [@progress]="{value: animationState, params: {width: data.wight + '%'}}"></div>
    </div>
  `,
  styles: [`
    .skill_item {
      display: block
    }
  `],
  host: {
    class: 'skill_item'
  },
  animations:[
    progressAnimation()
  ]
})
export class ProgressBar extends ScrollComponent implements OnInit {
  @Input() data!: ISkill;

  animationState = 0;

  ngOnInit(): void {
    this.scrollBottomPosition$
    .pipe(
      map((scrollPosition: number) => {
        return scrollPosition - 70 >= this.el.nativeElement.offsetTop
      }),
      distinctUntilChanged()
    )
    .subscribe((visible: boolean) => {
      this.animationState = visible ? 1 : 0;
    })
  }
}
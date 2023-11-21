import { Component } from "@angular/core";
import { fadeInLeftOnEnterAnimation, fadeInOnEnterAnimation, fadeInUpOnEnterAnimation, hueRotateAnimation, rollInAnimation, zoomInDownOnEnterAnimation, zoomInLeftAnimation } from "@shared/animations";

@Component({
  selector: "mia-hero",
  templateUrl: "./hero.component.html",
  styleUrls: ["./hero.component.scss"],
  animations: [
    zoomInDownOnEnterAnimation({ anchor: 'enterLetterAnim1' }),
    rollInAnimation({ anchor: 'letterAnim1' }),
    fadeInOnEnterAnimation({ anchor: 'enterLetterAnim2' }),
    zoomInLeftAnimation({ anchor: 'letterAnim2' }),
    hueRotateAnimation({ anchor: 'hueLetter', duration: 1000 }),
    fadeInOnEnterAnimation({anchor: 'fadeIn', duration: 1000}),
    fadeInUpOnEnterAnimation({anchor: 'fadeInUp'})
  ]
})
export class HeroComponent {

  readonly grettingText = 'Hay! This is Sajal Mia,'.split('');
  readonly titleText = "Professional Software Engineer".split('')

  animationState = false;
  hueState = false;

  getDelay(index: number, lenght: number) {
    if (index < lenght / 2 - 2) {
      return index * 100;
    } else {
      return lenght * 100 - index * 100;
    }
  }

  animate() {
    this.animationState = false;
    setTimeout(() => {
      this.animationState = true;
    }, 1);
  }
}

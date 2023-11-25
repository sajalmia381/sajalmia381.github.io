import { Component, OnInit } from "@angular/core";
import { fadeInAnimation, fadeInDownAnimation, fadeInUpAnimation } from "@shared/animations";
import { ScrollComponent } from "@shared/models/scroll.component";
import { distinctUntilChanged, map } from "rxjs/operators";

@Component({
  selector: "mia-contact",
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
  animations: [fadeInUpAnimation({ anchor: "fadeInUp", duration: 800 })],
})
export class ContactComponent extends ScrollComponent implements OnInit {
  animationState = 0;

  ngOnInit(): void {
    this.scrollBottomPosition$
      .pipe(
        map((scrollPosition: number) => {
          return scrollPosition - 250 >= this.el.nativeElement.offsetTop;
        }),
        distinctUntilChanged()
      )
      .subscribe((visible: boolean) => {
        this.animationState = visible ? 1 : 0;
      });
  }
}

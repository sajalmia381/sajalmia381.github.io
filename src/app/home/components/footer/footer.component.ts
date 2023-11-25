import { Component, OnInit } from "@angular/core";
import { fadeInUpAnimation, flipAnimation } from "@shared/animations";
import { ScrollComponent } from "@shared/models/scroll.component";
import { distinctUntilChanged, map } from "rxjs/operators";

@Component({
  selector: "mia-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
  animations: [flipAnimation({ duration: 800 }), fadeInUpAnimation({ duration: 800 })],
})
export class FooterComponent extends ScrollComponent implements OnInit {
  animationState = 0;

  ngOnInit(): void {
    this.scrollBottomPosition$
      .pipe(
        map((scrollPosition: number) => {
          return scrollPosition - 100 >= this.el.nativeElement.offsetTop;
        }),
        distinctUntilChanged()
      )
      .subscribe((visible: boolean) => {
        this.animationState = visible ? 1 : 0;
      });
  }
}

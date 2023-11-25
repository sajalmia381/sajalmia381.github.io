import { Component, OnInit, ViewChildren, inject } from "@angular/core";
import { HomeFacade } from "../../home.facade";
import { fadeInUpAnimation } from "@shared/animations";
import { ScrollComponent } from "@shared/models/scroll.component";
import { distinctUntilChanged, map } from "rxjs";

@Component({
  selector: "mia-home-portfolio",
  templateUrl: "./portfolio.component.html",
  styleUrls: ["./portfolio.component.scss"],
  animations: [fadeInUpAnimation({ anchor: "fadeInUp", translate: "150px", duration: 800 })],
})
export class PortfolioComponent extends ScrollComponent implements OnInit {
  private homeFacade = inject(HomeFacade);

  animationState = 0;

  isLoading: boolean = true;
  data$ = this.homeFacade.getPortfolio$();
  errorMsg: string = "";

  ngOnInit(): void {
    this.loadPosts();
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

  loadPosts(): void {
    this.isLoading = true;
    this.homeFacade.loadPortfolios().subscribe({
      error: err => {
        this.isLoading = false;
        console.log("err", err);
        this.errorMsg = err?.error?.message || "Something is wrong on blog";
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}

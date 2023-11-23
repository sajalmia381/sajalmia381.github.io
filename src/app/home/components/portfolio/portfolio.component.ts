import { Component, ElementRef, OnInit, inject } from "@angular/core";
import { Observable } from "rxjs";
import { HomeFacade } from "../../home.facade";
import { IPortfolio } from "../../modals";
import { fadeInUpAnimation } from "@shared/animations";
import { ScrollService } from "@shared/services/scroll.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "mia-home-portfolio",
  templateUrl: "./portfolio.component.html",
  styleUrls: ["./portfolio.component.scss"],
  animations: [
    fadeInUpAnimation({anchor: 'fadeInUp', translate: '150px', duration: 800}),
  ]
})
export class PortfolioComponent implements OnInit {
  private scrollService = inject(ScrollService);
  private homeFacade = inject(HomeFacade);
  private el = inject(ElementRef);

  animationState = 0;
  scrollPosition$ = this.scrollService.scrollBottomPosition$.pipe(takeUntilDestroyed());

  isLoading: boolean = true;
  data$ = this.homeFacade.getPortfolio$();
  errorMsg: string = "";

  ngOnInit(): void {
    this.loadPosts();
    this.scrollPosition$.subscribe((scrollPosition: number) => {
      const componentPosition = this.el.nativeElement.offsetTop;
      if (scrollPosition - 250 >= componentPosition) {
        this.animationState = 1;
      } else {
        this.animationState = 0;
      }
    })
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

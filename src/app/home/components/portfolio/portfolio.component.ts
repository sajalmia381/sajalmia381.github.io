import { Component, OnInit, inject } from "@angular/core";
import { HomeFacade } from "../../home.facade";
import { ScrollService } from "@shared/services/scroll.service";

@Component({
  selector: "mia-portfolio",
  templateUrl: "./portfolio.component.html",
  styleUrls: ["./portfolio.component.scss"],
})
export class PortfolioComponent implements OnInit {
  private homeFacade = inject(HomeFacade);
  private scrollService = inject(ScrollService);

  public scrollBottomPosition$ = this.scrollService.scrollBottomPosition$;

  isLoading: boolean = true;
  data$ = this.homeFacade.getPortfolio$();
  errorMsg: string = "";

  ngOnInit(): void {
    this.loadPosts();
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

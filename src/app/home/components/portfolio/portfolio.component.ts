import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { HomeFacade } from "../../home.facade";
import { IPortfolio } from "../../modals";

@Component({
  selector: "mia-home-portfolio",
  templateUrl: "./portfolio.component.html",
  styleUrls: ["./portfolio.component.scss"],
})
export class PortfolioComponent implements OnInit {
  isLoading: boolean = true;
  data$!: Observable<IPortfolio[] | null>;
  errorMsg: string = "";

  constructor(private homeFacade: HomeFacade) {
    this.data$ = this.homeFacade.getPortfolio$();
  }

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

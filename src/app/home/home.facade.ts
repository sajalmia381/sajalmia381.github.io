import { Injectable } from "@angular/core";
import { HomeState } from "./state/home.state";
import { HomeApi } from "./api/home.api";
import { Observable, tap } from "rxjs";
import { IPortfolio, IPost } from "./modals";

@Injectable()
export class HomeFacade {
  constructor(
    private homeState: HomeState,
    private homeApi: HomeApi
  ) {}

  getPosts$(): Observable<IPost[] | null> {
    return this.homeState.posts$;
  }

  getPortfolio$(): Observable<IPortfolio[] | null> {
    return this.homeState.portfolios$;
  }

  loadPosts() {
    return this.homeApi.getPosts().pipe(
      tap(data => {
        this.homeState.loadPosts((data as IPost[])?.slice(0, 6));
      })
    );
  }

  loadPortfolios() {
    return this.homeApi.getPortfolios().pipe(
      tap(data => {
        this.homeState.loadPortfolios((data as IPortfolio[])?.slice(0, 6));
      })
    );
  }
}

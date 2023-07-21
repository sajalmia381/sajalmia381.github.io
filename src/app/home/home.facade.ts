import { Injectable } from "@angular/core";
import { HomeState } from "./state/home.state";
import { HomeApi } from "./api/home.api";
import { Observable, tap } from "rxjs";
import { IPortfolio, IPost } from "./modals";

@Injectable()
export class HomeFacade {

  constructor(private homeState: HomeState, private homeApi: HomeApi) { }

  getPosts$(): Observable<IPost[] | null> {
    return this.homeState.posts$
  }

  loadPosts() {
    return this.homeApi.getPosts().pipe(tap(res => {
      this.homeState.loadPosts((res?.data as IPost[])?.slice(0, 6))
    }))
  }
  
  loadPortfolios() {
    return this.homeApi.getPortfolios().pipe(tap(res => {
      this.homeState.loadPortfolios((res?.data as IPortfolio[])?.slice(0, 6))
    }))
  }
}
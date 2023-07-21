import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { IPortfolio, IPost } from "../modals";

@Injectable()
export class HomeState {
  private posts: BehaviorSubject<IPost[] | null> = new BehaviorSubject<IPost[] | null>(null)
  public posts$: Observable<IPost[] | null> = this.posts.asObservable();
  
  private portfolios: BehaviorSubject<IPortfolio[] | null> = new BehaviorSubject<IPortfolio[] | null>(null)
  public portfolios$: Observable<IPortfolio[] | null> = this.portfolios.asObservable();

  public loadPosts(posts: IPost[]): void {
    this.posts.next(posts)
  }

  public loadPortfolios(portfolios: IPortfolio[]): void {
    this.portfolios.next(portfolios)
  }

}
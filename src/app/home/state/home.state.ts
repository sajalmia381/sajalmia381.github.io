import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { IPost } from "../modals";

@Injectable()
export class HomeState {
  private posts: BehaviorSubject<IPost[] | null> = new BehaviorSubject<IPost[] | null>(null)
  public posts$: Observable<IPost[] | null> = this.posts.asObservable();

  loadPosts(posts: IPost[]): void {
    this.posts.next(posts)
  }

}
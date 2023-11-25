import { Injectable } from "@angular/core";
import { BehaviorSubject, distinctUntilChanged, map, throttleTime } from "rxjs";

export interface IScroll {
  scrollY: number;
  innerHeight: number;
  // Add More
}

@Injectable({
  providedIn: "root",
})
export class ScrollService {
  private _scrollEvent = new BehaviorSubject<IScroll>({ scrollY: 0, innerHeight: 0 });
  public scrollData$ = this._scrollEvent.asObservable().pipe(
    // distinctUntilChanged(),
    throttleTime(100)
  );
  public scrollBottomPosition$ = this.scrollData$.pipe(map(data => data.scrollY + data.innerHeight));

  update(value: IScroll): void {
    this._scrollEvent.next(value);
  }
}

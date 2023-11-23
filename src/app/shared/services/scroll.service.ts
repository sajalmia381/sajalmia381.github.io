import { Injectable } from "@angular/core";
import { BehaviorSubject, distinctUntilChanged, map, throttleTime } from "rxjs";

export interface IWindowScroll {
  scrollY: number,
  innerHeight: number
  // Add More
}

@Injectable({
  providedIn: "root"
})
export class ScrollService {
  private _windowEvent = new BehaviorSubject<IWindowScroll>({scrollY: 0, innerHeight: 0})
  public windowScrollData$ = this._windowEvent.asObservable().pipe(
    // distinctUntilChanged(),
    throttleTime(100),
  );  
  public scrollBottomPosition$ = this.windowScrollData$.pipe(map((data) => data.scrollY + data.innerHeight))

  update(value: IWindowScroll): void {
    this._windowEvent.next(value)
  }
}
import { Component, OnInit, inject } from "@angular/core";
import { HomeFacade } from "../../home.facade";
import { distinctUntilChanged, map } from "rxjs";
import { bounceInAnimation } from "@shared/animations";
import { ScrollComponent } from "@shared/models/scroll.component";

@Component({
  selector: "mia-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.scss"],
  animations: [bounceInAnimation({ anchor: "bounceIn", duration: 800 })],
})
export class BlogComponent extends ScrollComponent implements OnInit {
  private homeFacade = inject(HomeFacade);

  isLoading: boolean = true;
  posts$ = this.homeFacade.getPosts$();
  errorMsg: string = "";

  animationState = 0;

  ngOnInit(): void {
    this.loadPosts();
    this.scrollBottomPosition$
      .pipe(
        map((scrollPosition: number) => {
          return scrollPosition - 220 >= this.el.nativeElement.offsetTop;
        }),
        distinctUntilChanged()
      )
      .subscribe((visible: boolean) => {
        this.animationState = visible ? 1 : 0;
      });
  }

  loadPosts(): void {
    this.isLoading = true;
    this.homeFacade.loadPosts().subscribe({
      error: err => {
        this.isLoading = false;
        console.log("err", err);
        this.errorMsg = err?.error?.message || "Something is wrong";
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}

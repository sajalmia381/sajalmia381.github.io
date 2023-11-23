import { Component, ElementRef, OnInit, inject } from "@angular/core";
import { HomeFacade } from "../../home.facade";
import { Observable } from "rxjs";
import { IPost } from "../../modals";
import { bounceInAnimation } from "@shared/animations";
import { ScrollService } from "@shared/services/scroll.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "mia-home-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.scss"],
  animations: [
    bounceInAnimation({anchor: 'bounceIn', duration: 800})
  ]
})
export class BlogComponent implements OnInit {
  private scrollService = inject(ScrollService);
  private homeFacade = inject(HomeFacade);
  private el = inject(ElementRef);

  isLoading: boolean = true;
  posts$ = this.homeFacade.getPosts$();
  errorMsg: string = "";

  animationState = 0;
  scrollPosition$ = this.scrollService.scrollBottomPosition$.pipe(takeUntilDestroyed());


  ngOnInit(): void {
    this.loadPosts();
    this.scrollPosition$.subscribe((scrollPosition: number) => {
      const componentPosition = this.el.nativeElement.offsetTop;
      if (scrollPosition - 220 >= componentPosition) {
        this.animationState = 1;
      } else {
        this.animationState = 0;
      }
    })
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

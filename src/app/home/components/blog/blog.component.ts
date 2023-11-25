import { Component, OnInit, inject } from "@angular/core";
import { HomeFacade } from "../../home.facade";
import { ScrollComponent } from "@shared/models/scroll.component";

@Component({
  selector: "mia-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.scss"],
})
export class BlogComponent extends ScrollComponent implements OnInit {
  private homeFacade = inject(HomeFacade);

  isLoading: boolean = true;
  posts$ = this.homeFacade.getPosts$();
  errorMsg: string = "";

  ngOnInit(): void {
    this.loadPosts();
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

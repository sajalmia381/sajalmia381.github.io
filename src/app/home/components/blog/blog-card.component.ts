import { Component, ElementRef, Input, OnInit, inject } from "@angular/core";
import { bounceInAnimation } from "@shared/animations";
import { IPost } from "../../modals";
import { Observable, distinctUntilChanged, map } from "rxjs";

@Component({
  selector: "mia-blog-card",
  template: `
    <article
      class="w-full bg-gray-900 bg-opacity-50 rounded-3xl shadow-xl overflow-hidden"
      [class.opacity-0]="animationState === 0"
      [@bounceIn]="{ value: animationState, params: { delay: 20 + 100 * index } }"
    >
      <div class="max-w-md mx-auto">
        <div
          *ngIf="post?.feature_images"
          class="h-[236px]"
          [style]="'background-image:url(' + post.feature_images + ');background-size:cover;background-position:center'"
        ></div>
        <div *ngIf="!post?.feature_images" class="h-[236px] flex items-center justify-center border-b border-teal-400/20">
          <span>No Preview Image</span>
        </div>

        <div class="p-4 sm:p-6">
          <div class="flex flex-row">
            <p class="text-[15px] font-bold text-[#0FB478]">{{ post.date | date: "mediumDate" }}</p>
          </div>
          <p class="font-bold text-[18px] leading-7 mb-3 mt-2">{{ post.title?.rendered }}</p>
          <a
            target="_blank"
            [href]="post.link"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-800 rounded-lg hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Read more
            <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  `,
  animations: [bounceInAnimation({ anchor: "bounceIn", duration: 800 })],
})
export class BlogCardComponent implements OnInit {
  @Input({ required: true }) post!: IPost;
  @Input({ required: true }) index!: number;
  @Input({ required: true }) scrollBottomPosition$!: Observable<number>;

  private el = inject(ElementRef);

  animationState = 0;

  ngOnInit(): void {
    this.scrollBottomPosition$
      .pipe(
        map((scrollPosition: number) => {
          return scrollPosition - 70 >= this.el.nativeElement.offsetTop;
        }),
        distinctUntilChanged()
      )
      .subscribe((visible: boolean) => {
        this.animationState = visible ? 1 : 0;
      });
  }
}

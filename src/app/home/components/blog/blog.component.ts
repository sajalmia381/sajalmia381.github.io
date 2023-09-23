import { Component, OnInit } from '@angular/core';
import { HomeFacade } from '../../home.facade';
import { Observable } from 'rxjs';
import { IPost } from '../../modals';

@Component({
  selector: 'mia-home-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  isLoading: boolean = true;
  posts$!: Observable<IPost[] | null>;
  errorMsg: string = '';

  constructor(private homeFacade: HomeFacade) {
    this.posts$ = this.homeFacade.getPosts$();
  }

  ngOnInit(): void {
    this.loadPosts()
  }

  loadPosts(): void {
    this.isLoading = true;
    this.homeFacade.loadPosts().subscribe({
      error: (err) => {
        this.isLoading = false
        console.log('err', err)
        this.errorMsg = err?.error?.message || "Something is wrong"
      },
      complete: () => {
        this.isLoading = false;
      }
    })
  }
}

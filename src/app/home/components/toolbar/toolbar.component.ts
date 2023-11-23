import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'mia-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent implements OnInit {

  constructor(@Inject(DOCUMENT) private document: Document){}

  ngOnInit(): void {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };
    
    let observer = new IntersectionObserver((entries) => {
      console.log(entries)
    }, options);
  }
}

import { Component } from '@angular/core';
import { fadeInUpOnEnterAnimation } from '@shared/animations';

@Component({
  selector: 'mia-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  animations: [
    fadeInUpOnEnterAnimation({anchor: 'fadeInUp'}),
  ]
})
export class ToolbarComponent {

}

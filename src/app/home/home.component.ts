import { Component, HostListener } from "@angular/core";
import { ScrollService } from "@shared/services/scroll.service";

@Component({
  selector: "mia-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  constructor(private scrollService: ScrollService) {}
  
  @HostListener('window:scroll', ['$event'])
  onScroll() {
    // console.log("update")
    this.scrollService.update({scrollY: window.scrollY, innerHeight: window.innerHeight})
  }
}

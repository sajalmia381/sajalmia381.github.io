import { animate, state, style, transition, trigger } from "@angular/animations";

export const slideIn = trigger("slideIn", [
  state(
    "*",
    style({
      transform: "translateY(100%)"
    })
  ),
  state(
    "in",
    style({
      transform: "translateY(0)"
    })
  ),
  state(
    "out",
    style({
      transform: "translateY(-100%)"
    })
  ),
  transition("* => in", animate("600ms ease-in")),
  transition("in => out", animate("600ms ease-in"))
]);
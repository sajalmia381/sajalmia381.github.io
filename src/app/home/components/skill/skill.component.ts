import { Component } from "@angular/core";

type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc["length"]]>;

type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

type ISkill = {
  name: string;
  wight: Range<1, 100>;
  progressBarColor?: string;
};

@Component({
  selector: "mia-skill",
  templateUrl: "./skill.component.html",
  styleUrls: ["./skill.component.scss"],
})
export class SkillComponent {
  skill_list: ISkill[] = [
    {
      name: "HTML",
      wight: 90,
    },
    {
      name: "CSS",
      wight: 90,
      progressBarColor: "bg-purple-500",
    },
    {
      name: "SASS",
      wight: 90,
      progressBarColor: "bg-yellow-500",
    },

    {
      name: "Javascript",
      wight: 90,
    },
    {
      name: "TypeScript",
      wight: 80,
      progressBarColor: "bg-purple-500",
    },
    {
      name: "Jquery",
      wight: 60,
      progressBarColor: "bg-yellow-500",
    },

    {
      name: "Angular",
      wight: 90,
    },
    {
      name: "Angular Material",
      wight: 85,
      progressBarColor: "bg-purple-500",
    },
    {
      name: "RxJs",
      wight: 80,
      progressBarColor: "bg-yellow-500",
    },

    {
      name: "NGRX",
      wight: 70,
    },
    {
      name: "Tailwindcss",
      wight: 90,
      progressBarColor: "bg-purple-500",
    },
    {
      name: "Bootstrap",
      wight: 90,
      progressBarColor: "bg-yellow-500",
    },

    {
      name: "NX",
      wight: 70,
    },
    {
      name: "Node",
      wight: 70,
      progressBarColor: "bg-purple-500",
    },
    {
      name: "Express",
      wight: 70,
      progressBarColor: "bg-yellow-500",
    },

    {
      name: "Git",
      wight: 90,
    },
    {
      name: "Docker",
      wight: 40,
      progressBarColor: "bg-purple-500",
    },
    {
      name: "Kubernetes",
      wight: 30,
      progressBarColor: "bg-yellow-500",
    },
  ];
}

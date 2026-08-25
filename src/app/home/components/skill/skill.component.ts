import { Component } from "@angular/core";

type Enumerate<N extends number, Acc extends number[] = []> = Acc["length"] extends N ? Acc[number] : Enumerate<N, [...Acc, Acc["length"]]>;

type Range<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export type ISkill = {
  name: string;
  weight: Range<1, 100>;
  progressBarColor?: string;
};

@Component({
  standalone: false,
  selector: "mia-skill",
  templateUrl: "./skill.component.html",
  styleUrls: ["./skill.component.scss"],
})
export class SkillComponent {
  skill_list: ISkill[] = [
    {
      name: "HTML",
      weight: 90,
    },
    {
      name: "CSS / SASS",
      weight: 90,
      progressBarColor: "bg-purple-500",
    },
    {
      name: "JavaScript",
      weight: 90,
      progressBarColor: "bg-yellow-500",
    },

    {
      name: "TypeScript",
      weight: 90,
    },
    {
      name: "Angular",
      weight: 90,
      progressBarColor: "bg-purple-500",
    },
    {
      name: "Angular Material",
      weight: 85,
      progressBarColor: "bg-yellow-500",
    },

    {
      name: "RxJs",
      weight: 80,
    },
    {
      name: "NGRX",
      weight: 70,
      progressBarColor: "bg-purple-500",
    },
    {
      name: "Tailwindcss",
      weight: 90,
      progressBarColor: "bg-yellow-500",
    },

    {
      name: "React",
      weight: 70,
    },
    {
      name: "Next.js",
      weight: 65,
      progressBarColor: "bg-purple-500",
    },
    {
      name: "SPFx / SharePoint",
      weight: 60,
      progressBarColor: "bg-yellow-500",
    },

    {
      name: "NX",
      weight: 70,
    },
    {
      name: "Node",
      weight: 70,
      progressBarColor: "bg-purple-500",
    },
    {
      name: "Go",
      weight: 60,
      progressBarColor: "bg-yellow-500",
    },

    {
      name: "PostgreSQL",
      weight: 60,
    },
    {
      name: ".NET",
      weight: 50,
      progressBarColor: "bg-purple-500",
    },
    {
      name: "Git",
      weight: 90,
      progressBarColor: "bg-yellow-500",
    },

    {
      name: "Docker",
      weight: 60,
    },
    {
      name: "Kubernetes",
      weight: 50,
      progressBarColor: "bg-purple-500",
    },
    {
      name: "Bootstrap",
      weight: 85,
      progressBarColor: "bg-yellow-500",
    },
  ];
}

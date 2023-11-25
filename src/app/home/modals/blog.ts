import { ITitle } from "./title";

export interface IPost {
  link: string | undefined;
  feature_images: string | undefined;
  title: ITitle | undefined;
  date: string | undefined;
}

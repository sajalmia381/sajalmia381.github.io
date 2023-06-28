import { ITitle } from "./title";

export interface IPortfolio {
  feature_images: string | undefined,
  link: string | undefined,
  title: ITitle | undefined,
  date: string | undefined,
}

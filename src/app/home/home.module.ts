import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { HomeComponent } from "./home.component";

import { HomeApi } from "./api/home.api";
import { HomeState } from "./state/home.state";
import { HomeFacade } from "./home.facade";

import { BlogComponent } from "./components/blog/blog.component";
import { PortfolioComponent } from "./components/portfolio/portfolio.component";
import { HeroComponent } from "./components/hero/hero.component";
import { ExperienceComponent } from "./components/experience/experience.component";
import { SkillComponent } from "./components/skill/skill.component";
import { ContactComponent } from "./components/contact/contact.component";
import { FooterComponent } from "./components/footer/footer.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { RouterModule } from "@angular/router";
import { ExperienceItemComponent } from "./components/experience/experience-item/experience-item.component";

@NgModule({
  declarations: [
    HomeComponent,
    HeroComponent,
    ToolbarComponent,
    BlogComponent,
    PortfolioComponent,
    ExperienceComponent,
    ExperienceItemComponent,
    SkillComponent,
    ContactComponent,
    FooterComponent,
  ],
  imports: [CommonModule, HttpClientModule, RouterModule],
  exports: [HomeComponent],
  providers: [HomeApi, HomeState, HomeFacade],
})
export class HomeModule {}

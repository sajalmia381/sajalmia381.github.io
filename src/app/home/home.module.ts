import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { HomeComponent } from "./home.component";

import { HomeApi } from "./api/home.api";
import { HomeState } from "./state/home.state";
import { HomeFacade } from "./home.facade";

import { BlogComponent } from "./components/blog/blog.component";
import { BlogCardComponent } from "./components/blog/blog-card.component";
import { PortfolioComponent } from "./components/portfolio/portfolio.component";
import { PortfolioCardComponent } from "./components/portfolio/protfolio-card.component";
import { HeroComponent } from "./components/hero/hero.component";
import { ExperienceComponent } from "./components/experience/experience.component";
import { ExperienceItemComponent } from "./components/experience/experience-item/experience-item.component";
import { SkillComponent } from "./components/skill/skill.component";
import { ProgressBar } from "./components/skill/progress-bar.component";
import { ContactComponent } from "./components/contact/contact.component";
import { FooterComponent } from "./components/footer/footer.component";
import { ToolbarComponent } from "./components/toolbar/toolbar.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    HomeComponent,
    HeroComponent,
    ToolbarComponent,
    BlogComponent,
    BlogCardComponent,
    PortfolioComponent,
    PortfolioCardComponent,
    ExperienceComponent,
    ExperienceItemComponent,
    SkillComponent,
    ProgressBar,
    ContactComponent,
    FooterComponent,
  ],
  exports: [HomeComponent],
  imports: [CommonModule, RouterModule],
  providers: [HomeApi, HomeState, HomeFacade, provideHttpClient(withInterceptorsFromDi())],
})
export class HomeModule {}

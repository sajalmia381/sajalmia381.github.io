import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HomeModule } from "./home/home.module";
import { APP_ENV } from "@package/constants/injection.token";
import { environment } from "src/environments/environment";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, HomeModule],
  providers: [
    {
      provide: APP_ENV,
      useValue: environment,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

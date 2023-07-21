import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable, Optional } from "@angular/core";
import { APP_ENV } from "@package/constants/injection.token";
import { IEnv } from "@package/interfaces/env.interface";
import * as endpoints from './home.endpoints';
import { Observable } from "rxjs";

@Injectable()
export class HomeApi {

  headerOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(@Optional() @Inject(APP_ENV) private env: IEnv, private http: HttpClient) { }

  getPosts(): Observable<any> {
    return this.http.get(this.getPath(endpoints.BLOG_LIST), this.headerOptions)
  }
  
  getPortfolios(): Observable<any> {
    return this.http.get(this.getPath(endpoints.PORTFOLIO_LIST), this.headerOptions)
  }

  // Helpers
  private getPath(...arg: string[]): string {
    return [this.env.API_BASE_URL, ...arg].join('/')
  }
}
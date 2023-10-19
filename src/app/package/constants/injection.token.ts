import { InjectionToken } from "@angular/core";
import { IEnv } from "../interfaces/env.interface";

export const APP_ENV = new InjectionToken<IEnv>("app_env");

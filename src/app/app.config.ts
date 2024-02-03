import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideHttpClient, withFetch, HttpClientModule} from "@angular/common/http";
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import {en_US, NZ_I18N} from "ng-zorro-antd/i18n";
import {NZ_ICONS} from "ng-zorro-antd/icon";

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withFetch()),
    { provide: NZ_I18N, useValue: en_US }]
};

import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom, isDevMode, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { icons } from './icons-provider';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNgIdle } from '@ng-idle/core';
import { jwtInterceptor } from './interceptors/jwt/jwt.interceptor';
import { httpErrorInterceptor } from './interceptors/httpError/http-error.interceptor';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from './core/i18n/translate-loader';
import { provideServiceWorker } from '@angular/service-worker';
import { KeycloakService } from './services/keycloak/keycloak.service';
import { TRANSLATE_HTTP_LOADER_CONFIG } from '@ngx-translate/http-loader';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzIcons(icons),
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([
        jwtInterceptor,
        httpErrorInterceptor,
      ])
    ),
    provideNgIdle(),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [],
      },
      defaultLanguage: 'en', // Set the default language
    }),
    {
      provide: TRANSLATE_HTTP_LOADER_CONFIG,
      useValue: {
        prefix: './assets/i18n/',
        suffix: '.json'
      }
    },
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    KeycloakService,
    provideAppInitializer(() => {
      const keycloak = inject(KeycloakService);
      return keycloak.init();
    })
  ]
};

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  API_DOMAIN,
  JWTToken,
  NgServicesModule,
  TOKEN_JWT,
  TOKEN_REFRESH_TIME,
  TOKEN_STORAGE_KEY
} from '@desarrollo_web/ng-services';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxElectronModule } from 'ngx-electron';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';

import { AppConfig } from '../environments/environment';
import { AppInitService } from './app-init.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Device } from './shared/services/device/device';
import { Lang } from './shared/services/lang/lang';
import { SharedModule } from './shared/shared.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DeviceModule } from './device/device.module';
import {
  API_HTTP_HEADERS,
  API_HTTP_TIMEOUT,
  APP_ENV,
  APP_VERSION,
  AUTH_DEFAULT_PASSWORD,
  AUTH_DEFAULT_STOREID, DEVICE, DEVICE_STORAGE_KEY,
  LANG,
  LANG_DEFAULT,
  LANG_LIST,
  LANG_STORAGE_KEY,
  THEME, THEME_DEFAULT,
  THEME_LIST,
  THEME_STORAGE_KEY,
} from './tokens';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function AppInitFactory(appInitService: AppInitService) {
  return (): Promise<boolean> => appInitService.init();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    // Angular modules
    BrowserModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

    // Package modules
    NgxElectronModule,
    LoggerModule.forRoot({
      level: AppConfig.production ? NgxLoggerLevel.INFO : NgxLoggerLevel.DEBUG,
      timestampFormat: 'HH:mm:ss',
    }),

    // Local modules
    NgServicesModule,

    // App modules
    SharedModule,
    DashboardModule,
    DeviceModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: AppInitFactory, deps: [AppInitService], multi: true },
    { provide: APP_VERSION, useValue: '0.0.0' },
    { provide: APP_ENV, useValue: AppConfig.environment },
    { provide: LANG, useValue: new BehaviorSubject<Lang>(null) },
    {
      provide: LANG_LIST,
      useValue: new BehaviorSubject<Lang[]>([
        {
          idioma: 'es',
          idiomajs: 'es',
          bandera: '',
          descri: 'Esp'
        }
      ])
    },
    { provide: LANG_DEFAULT, useValue: 'en' },
    { provide: LANG_STORAGE_KEY, useValue: 'lang' },
    { provide: THEME, useValue: new BehaviorSubject<string>(null) },
    { provide: THEME_LIST, useValue: { ayl: 'ayl', myrl: 'myrl' } },
    { provide: THEME_DEFAULT, useValue: 'myrl' },
    { provide: THEME_STORAGE_KEY, useValue: 'theme' },
    { provide: TOKEN_REFRESH_TIME, useValue: 5 * 1000 },
    { provide: TOKEN_JWT, useValue: new BehaviorSubject<JWTToken>(null) },
    { provide: TOKEN_STORAGE_KEY, useValue: 'access_token' },
    { provide: AUTH_DEFAULT_STOREID, useValue: 501 },
    { provide: AUTH_DEFAULT_PASSWORD, useValue: '7759B882YT' },
    { provide: API_HTTP_TIMEOUT, useValue: 15000 },
    { provide: API_HTTP_HEADERS, useValue: { 'Content-Type': 'application/json; charset=utf-8' } },
    { provide: API_DOMAIN, useValue: AppConfig.URL_API400 },
    { provide: DEVICE, useValue: new BehaviorSubject<Device>(new Device()) },
    { provide: DEVICE_STORAGE_KEY, useValue: 'device' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxElectronModule } from 'ngx-electron';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';

import { AppConfig } from '../environments/environment';
import { AppInitService } from './app-init.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './pages/home/home.module';
import { ProductModule } from './pages/product/product.module';
import { Lang } from './shared/services/lang/classes/GetLangs';
import { JwtLogin } from './shared/services/login/classes/JwtLogin';
import { SharedModule } from './shared/shared.module';
import {
  APP_ENV,
  APP_VERSION,
  AUTH_DEFAULT_PASSWORD,
  AUTH_DEFAULT_STOREID,
  HTTP_REQUEST_TIMEOUT,
  LANG,
  LANG_DEFAULT,
  LANG_LIST,
  LANG_STORAGE_KEY,
  THEME, THEME_DEFAULT,
  THEME_LIST,
  THEME_STORAGE_KEY,
  TOKEN_JWT,
  TOKEN_REFRESH_TIME,
  TOKEN_STORAGE_KEY
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

    // App modules
    SharedModule,
    HomeModule,
    ProductModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: AppInitFactory, deps: [AppInitService], multi: true },
    { provide: APP_ENV, useValue: AppConfig.environment },
    { provide: APP_VERSION, useValue: AppConfig.version },
    { provide: LANG, useValue: new BehaviorSubject<Lang>(null) },
    { provide: LANG_LIST, useValue: new BehaviorSubject<Lang[]>(null) },
    { provide: LANG_DEFAULT, useValue: 'en' },
    { provide: LANG_STORAGE_KEY, useValue: 'lang' },
    { provide: THEME, useValue: new BehaviorSubject<string>(null) },
    { provide: THEME_LIST, useValue: { ayl: 'ayl', myrl: 'myrl' } },
    { provide: THEME_DEFAULT, useValue: 'myrl' },
    { provide: THEME_STORAGE_KEY, useValue: 'theme' },
    { provide: TOKEN_REFRESH_TIME, useValue: 5 * 1000 },
    { provide: TOKEN_JWT, useValue: new BehaviorSubject<JwtLogin>(null) },
    { provide: TOKEN_STORAGE_KEY, useValue: 'JwtLogin' },
    { provide: AUTH_DEFAULT_STOREID, useValue: 501 },
    { provide: AUTH_DEFAULT_PASSWORD, useValue: '7759B882YT' },
    { provide: HTTP_REQUEST_TIMEOUT, useValue: 15000 },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

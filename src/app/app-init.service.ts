import { Injectable, Inject } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { mergeMap } from 'rxjs/operators';
import { DeviceService, LangService, LoginService, ThemeService } from './shared/services';
import { APP_VERSION, AUTH_DEFAULT_PASSWORD, AUTH_DEFAULT_STOREID } from './tokens';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  constructor(
    private loginService: LoginService,
    private langService: LangService,
    private themeService: ThemeService,
    private deviceService: DeviceService,
    private electronService: ElectronService,
    @Inject(AUTH_DEFAULT_STOREID) private defaultStoreID: number,
    @Inject(AUTH_DEFAULT_PASSWORD) private defaultPassword: string,
    @Inject(APP_VERSION) private appVersion: string,
  ) { }

  init(): Promise<boolean> {

    // Cargamos el tema
    this.themeService.loadTheme();

    return new Promise((resolve) => {

      // Autenticamos el usuario
      this.loginService.login(this.defaultStoreID, this.defaultPassword)
        .pipe(
          // Comprobamos el dispositivo
          mergeMap(() => this.deviceService.checkOrRedirect()),
          // Obtenemos los idiomas disponibles
          mergeMap(() => this.langService.getLanguages()),
        )
        .subscribe(() => {

          // Asignamos el idioma
          const lang = this.langService.getPreferredLang();
          if (lang) {
            this.langService.setLang(lang);
          }

          resolve(true);
        });
    });
  }

}

import { Injectable, Inject } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { AuthService, LangService, LoginService, ThemeService } from './shared/services';
import { AUTH_DEFAULT_PASSWORD, AUTH_DEFAULT_STOREID } from './tokens';

@Injectable({
  providedIn: 'root'
})
export class AppInitService {

  constructor(
    private authService: AuthService,
    private loginService: LoginService,
    private langService: LangService,
    private themeService: ThemeService,
    @Inject(AUTH_DEFAULT_STOREID) private defaultStoreID: number,
    @Inject(AUTH_DEFAULT_PASSWORD) private defaultPassword: string,
  ) { }

  init(): Promise<boolean> {

    return new Promise((resolve) => {

      // Cargamos el tema
      this.themeService.loadTheme();

      // Realizamos `login` del usuario y obtenemos
      // los idiomas disponibles seguidamente.
      this.loginService.login(this.defaultStoreID, this.defaultPassword)
        .pipe(mergeMap(() => this.langService.getLanguages()))
        .subscribe(() => {

          // Asignamos el idioma
          const lang = this.langService.getPreferredLang();
          this.langService.setLang(lang);

          resolve(true);
        });
    });
  }

}

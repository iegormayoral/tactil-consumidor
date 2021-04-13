import { Inject, Injectable } from '@angular/core';
import { APIRequest } from '@desarrollo_web/ng-services';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { TOKEN_JWT } from '~/tokens';
import { API400Service } from '../api/api400.service';
import { AuthService } from '../auth/auth.service';
import { GetLogin } from './classes/GetLogin';
import { JwtLogin } from './classes/JwtLogin';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private api400Service: API400Service,
    private authService: AuthService,
    private logger: NGXLogger,
    @Inject(TOKEN_JWT) private token: BehaviorSubject<JwtLogin>,
  ) { }

  login(tienda: number, password: string): Observable<GetLogin> {
    if (this.authService.isLoggedIn()) {
      const data = new GetLogin();
      data.datos = this.token.getValue();
      return of(data);
    }

    const area = 'SHOP';
    const programa = 'LGNEPGM00';
    const params = {
      datos: {
        programa,
        area,
        version: 0,
        body: {
          tienda,
          password,
        }
      }
    };

    // Realizamos la petición
    // y marcamos que es un login para que no agregue la cabecera de Autenticación.
    const request = new APIRequest(`${area}/${programa}`, params, GetLogin);
    request.isLogin = true;

    return this.api400Service.post<GetLogin>(request)
      .pipe(
        map(data => {

          if (!data.allOk()) {
            this.logger.error('Login error', data.getErrorMessage());
            this.authService.setToken(null);
          }
          else {
            this.authService.setToken(data.datos);
          }

          return data;
        }),
      );
  }

}


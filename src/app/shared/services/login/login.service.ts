import { Inject, Injectable } from '@angular/core';
import { AuthService, APIService, APIRequest, JWTResponse, JWTToken, TOKEN_JWT } from '@desarrollo_web/ng-services';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private api: APIService,
    private logger: NGXLogger,
    private authService: AuthService,
    @Inject(TOKEN_JWT) private token: BehaviorSubject<JWTToken>,
  ) { }

  login(tienda: number, password: string): Observable<JWTResponse> {
    if (this.authService.isLoggedIn()) {
      const data = new JWTResponse();
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
    const request = new APIRequest(`${area}/${programa}`, params, JWTResponse);
    request.isLogin = true;

    return this.api.post<JWTResponse>(request)
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


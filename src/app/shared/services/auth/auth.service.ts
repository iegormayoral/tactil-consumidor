import { Inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { JsonConvert } from 'json2typescript';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, Observable } from 'rxjs';
import { log } from 'util';

import { TOKEN_JWT, TOKEN_REFRESH_TIME, TOKEN_STORAGE_KEY } from '../../../tokens';
import { API400Service } from '../api/api400.service';
import { ApiPost } from '../api/classes/Api';
import { JWTRefresh } from '../api/classes/JWTRefresh';
import { JwtLogin } from '../login/classes/JwtLogin';
import Timeout = NodeJS.Timeout;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwtHelper: JwtHelperService;
  private refreshTimeout: Timeout;

  constructor(
    private api400Service: API400Service,
    private logger: NGXLogger,
    @Inject(TOKEN_REFRESH_TIME) private tokenRefreshTime: number,
    @Inject(TOKEN_STORAGE_KEY) private tokenStorageKey: string,
    @Inject(TOKEN_JWT) private token: BehaviorSubject<JwtLogin>,
  ) {

    this.jwtHelper = new JwtHelperService();

    this.token.next(this.getToken());

    this.token.subscribe(value => {
      this.logger.debug('Token was changed', value);

      if (this.isLoggedIn()) {
        this.startRefreshTimer();
      }
    });
  }

  isLoggedIn(): boolean {
    let loggedIn = true;

    const token = this.token.getValue();
    if (!token) {
      loggedIn = false;
    }
    else if (!token.jwt || !token.jwtrefresh) {
      loggedIn = false;
    }
    else if (this.jwtHelper.isTokenExpired(token.jwtrefresh)) {
      loggedIn = false;
    }

    return loggedIn;
  }

  /**
   * Recupera el token almacenado
   */
  private getToken(): JwtLogin {
    let token: JwtLogin;

    try {
      let data = localStorage.getItem(this.tokenStorageKey);
      if (data) {
        data = JSON.parse(data);

        const jsonConvert: JsonConvert = new JsonConvert();
        token = jsonConvert.deserializeObject(data, JwtLogin);
      }
      // eslint-disable-next-line no-empty
    } catch (e) { }

    if (!token) {
      token = new JwtLogin();
    }
    return token;
  }

  /**
   * Guarda el token
   */
  setToken(data: JwtLogin): void {
    if (!data) {
      return;
    }

    localStorage.setItem(this.tokenStorageKey, JSON.stringify(data));
    this.token.next(data);
  }

  /**
   * Establece el resfresh token 5 segundos antes de que caduque
   */
  startRefreshTimer(): void {
    this.logger.debug('Refresh timer started');

    let token = this.token.getValue();

    const helper = new JwtHelperService();
    const expires = helper.getTokenExpirationDate(token.jwt);

    if (!helper.isTokenExpired(token.jwtrefresh)) {
      // Calculamos la fecha menos 5 segundos
      const timeout = expires.getTime() - Date.now() - this.tokenRefreshTime;

      if (this.refreshTimeout) {
        this.clearRefreshTimer();
      }

      // Establecemos el refresco 5 minutos antes de que caduque el token
      this.refreshTimeout = setTimeout(() => {
        token = this.token.getValue();

        // Justo antes de refrescar comprobamos si le quedan menos de 5 segundos para caducar
        // Por si otro evento lo ha renovado ya
        const check_timeout = expires.getTime() - Date.now() - this.tokenRefreshTime;
        console.log(check_timeout, this.tokenRefreshTime);

        console.log('Intentamos refrescar ' + check_timeout.toString());
        if (check_timeout < this.tokenRefreshTime) {

          console.log('Refrescando token ' + (new Date()).toLocaleTimeString());
          this.refreshToken()
            .subscribe(data => this.setToken(data.datos));
        }
      }, timeout);
    }
    else {
      this.logger.debug('The refresh token was expired');
      this.setToken(null);
    }
  }

  /**
   * Detiene la renovación del token
   */
  clearRefreshTimer(): void {
    clearTimeout(this.refreshTimeout);
    this.refreshTimeout = null;
  }

  /**
   * Refresca el token
   */
  refreshToken(): Observable<JWTRefresh> {
    const params = {
      datos: {
        programa : 'JWTRPGM00',
        area : 'SREST',
        version: 0,
        body: {}
      }
    };

    // Realizamos la petición
    // marcando `isLogin` y `isRefresh` para refrescar el token actual.
    const apiPostRefresh = new ApiPost('srest/JWTRPGM00', JSON.stringify(params), JWTRefresh);
    apiPostRefresh.isLogin = true;
    apiPostRefresh.isRefresh = true;

    return this.api400Service.post(apiPostRefresh);
  }

}

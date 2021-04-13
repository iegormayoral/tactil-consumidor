import { Inject, Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { TOKEN_JWT } from '~/tokens';
import { API_HTTP_HEADERS, API_HTTP_TIMEOUT, APIRequest, APIService, Headers } from '@desarrollo_web/ng-services';
import { JwtLogin } from '../login/classes/JwtLogin';
import { AppConfig } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
/**
 * Clase que se comunica con los servicios rest de 400
 */
export class API400Service extends APIService {

  constructor(
    public http: HttpClient,
    public logger: NGXLogger,
    @Inject(API_HTTP_TIMEOUT) public httpTimeout: number,
    @Inject(API_HTTP_HEADERS) public httpHeaders: Headers,
    @Inject(TOKEN_JWT) public token: BehaviorSubject<JwtLogin>,
  ) {
    super(http, httpTimeout, httpHeaders);
  }

  /**
   * Obtiene el token de authorization para la api400
   * Si el token esta caducado esta función hace el refresh
   * si esta caducado el access y el refresh devuelve null
   * En las peticiones de login no envia ningún token
   */
  getAuthorizationBearer(request: APIRequest): string | null {
    const token = this.token.getValue();
    const helper = new JwtHelperService();

    // Si estamos ejecutando una llamada para renovar el token, tenemos que meter en el
    // las cabeceras el token refresh
    if (request.isRefresh) {

      // Si estamos refrescando y el token refresh ha caducado
      const isExpired = helper.isTokenExpired(token.jwtrefresh);
      const expirationDate = helper.getTokenExpirationDate(token.jwtrefresh);

      if (isExpired) {
        // Si ha expirado no podemos hacer nada
        this.logger.debug('JWT Refresh Token expired!');
        return null;
      }
      else {
        // Si no ha expirado el token refresh entonces podemos devolvemos este token
        this.logger.debug(`JWT Refresh Token not expired (exp: ${expirationDate.toLocaleTimeString()})`);
        return token.jwtrefresh;
      }
    }
    // Si no estamos ejecutando una llamada para renovar el token, puede ser
    // - Llamada normal con auntenticación
    // - LLamada de login, si es de login no hace falta el token access asi que devolvemos null
    else {
      if (request.isLogin) return '';

      // Verificamos si hace falta refrescar
      const expires = helper.getTokenExpirationDate(token.jwt);

      //const decodedToken = helper.decodeToken(jwtLogin.jwt);
      //const expirationDate = helper.getTokenExpirationDate(jwtLogin.jwt);
      const isExpired = helper.isTokenExpired(token.jwt);
      const expirationDate = helper.getTokenExpirationDate(token.jwt);

      // If the jwt token is expired, we use the refresh token
      if (!isExpired) {
        // Para evitar saturar la consola de logs,
        // deshabilitamos el log de expiración cuando el token sea válido.
        // this.logger.debug(`JWT Token not expired (exp: ${expirationDate.toLocaleTimeString()})`);
        return token.jwt;
      }
      else {
        this.logger.debug('JWT Token expired!');
        return null;
      }
    }
  }

  /**
   * Devuelve la url del servicio rest
   */
  getAPIPath(request: APIRequest): string {
    return `${AppConfig.URL_API400}/${request.path}`;
  }

}

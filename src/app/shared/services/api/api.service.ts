import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { JsonConvert, JsonObject, JsonProperty, OperationMode, ValueCheckingMode } from 'json2typescript';
import { AppConfig } from '../../../../environments/environment';
import { HTTP_REQUEST_TIMEOUT } from '../../../tokens';
import { APIPost } from './classes/api';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(
    public http: HttpClient,
    @Inject(HTTP_REQUEST_TIMEOUT) public requestTimeout: number,
  ) { }

  /**
   * Devuelve el path de la llamada
   * @param apiPost
   */
  getAPIPath(apiPost: APIPost): string {
    return `${apiPost.path}`;
  }

  /**
   * Obtiene el token para la autorization, si la llamada que estamos haciendo no es un login
   */
  getAuthorizationBearer(apiPost: APIPost): string | null {
    if(apiPost.isLogin) return null;
    return null;
  }

  post<T>(apiPost: APIPost): Observable<T> {
    // Authorization bearer
    let headersHttp = new HttpHeaders({...AppConfig.Headers});
    const authToken = this.getAuthorizationBearer(apiPost);
    const data = new apiPost.ClassReference();
    if(authToken == null && apiPost.isRefresh || !apiPost.isLogin){
      data.errorCode = 401;
      data.errorMessage = 'Unauthorized';
    }
    if (authToken) {
      headersHttp.delete('Authorization');
      headersHttp = headersHttp.append('Authorization',`Bearer ${authToken}`);
    }
    // Path url, le añadimos el prefijo del servidor
    apiPost.path = this.getAPIPath(apiPost);
    // Options
    const options = { headers: headersHttp };

    return this.http.post<T>(apiPost.path, JSON.stringify(apiPost.body), options)
      .pipe(
        timeout(this.requestTimeout),
        map(data => this.deserializeJSON(data, apiPost.ClassReference),
            error => {
              data.errorMessage = error.getMessage();
              return of(data);
            }),
        catchError((error: Response) => {
          const data = new apiPost.ClassReference();
          data.errorMessage = error.statusText;
          return of(data);
        })
      );
  }

  /**
   * Deserializa un string en formato JSON a partir de una clase
   * @param json
   * @param ClassReference
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  deserializeJSON(json: any, ClassReference: any): any {
    let data: any;
    try {
      const jsonConvert = new JsonConvert(OperationMode.ENABLE, ValueCheckingMode.ALLOW_NULL, false);
      data = jsonConvert.deserialize(json, ClassReference);
    } catch (e) {
      data = new ClassReference();
      data.errorCode = 99;
      data.errorMessage = e.toString();
      console.log((<Error>e));
    }
    return data;
  }

}

@JsonObject('JsonToObject')
export class JsonToObject {
  // {"errorCode":101,"errorMessage":""}
  // This maps the value of the JSON key "name" to the class property "name".
  // If the JSON value is not of type string (or missing), there will be an exception.

  @JsonProperty("errorCode", Number)
  errorCode: number = undefined;

  @JsonProperty("errorMessage", String)
  errorMessage: string = undefined;

  /**
   * funcion que indica si ha ido bien el parseo de los datos
   * @returns {boolean}
   */
  public allOk(): boolean {
    return this.errorCode === 0;
  }

  public getErrorMessage():string{
    return this.errorMessage;
  }
}

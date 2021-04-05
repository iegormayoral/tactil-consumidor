/**
 * Clase que cotiene todas las variables necesarios para hacer un post
 */
export class ApiPost {

  constructor(path,body,ClassReference){
    this.path = path;
    this.body = body;
    this.ClassReference = ClassReference;
  }

  /** Path para el servicio rest */
  path: string;
  /** Body en json */
  body: any = {};
  /** Cabeceras */
  headers: object = {};
  /** Clase para deserializar */
  ClassReference: any;
  /** Indica si vamos a hacer un login o no */
  isLogin = false;

  isRefresh = false;
}

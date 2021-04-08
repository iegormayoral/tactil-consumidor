import { InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Lang } from './shared/services/lang/lang';
import { JwtLogin } from './shared/services/login/classes/JwtLogin';

/**
 * Entorno de la aplicación
 */
export const APP_ENV = new InjectionToken<string>('APP_ENV');

/**
 * Versión de la aplicación
 */
export const APP_VERSION = new InjectionToken<string>('APP_VERSION');

/**
 * Token del usuario
 */
export const TOKEN_JWT = new InjectionToken<BehaviorSubject<JwtLogin>>('TOKEN_JWT');

/**
 * Tiempo de refresco del token
 */
export const TOKEN_REFRESH_TIME = new InjectionToken<number>('TOKEN_REFRESH_TIME');

/**
 * Identificador usado para almacenar el token
 */
export const TOKEN_STORAGE_KEY = new InjectionToken<string>('TOKEN_STORAGE_KEY');

/**
 * ID de autentificación por defecto de la tienda
 */
export const AUTH_DEFAULT_STOREID = new InjectionToken<number>('AUTH_DEFAULT_STOREID');

/**
 * Contraseña de autentificación por defecto de la tienda
 */
export const AUTH_DEFAULT_PASSWORD = new InjectionToken<string>('AUTH_DEFAULT_PASSWORD');

/**
 * Idioma de la aplicación
 */
export const LANG = new InjectionToken<BehaviorSubject<Lang>>('LANG');

/**
 * Idioma por defecto en caso de no encontrar idiomas disponibles
 */
export const LANG_DEFAULT = new InjectionToken<string>('LANG_DEFAULT');

/**
 * Listado de idiomas disponibles
 */
export const LANG_LIST = new InjectionToken<BehaviorSubject<Lang[]>>('LANG_LIST');

/**
 * Identificador usado para almacenar el idioma
 */
export const LANG_STORAGE_KEY = new InjectionToken<string>('LANG_STORAGE_KEY');

/**
 * Tema de la aplicación
 */
export const THEME = new InjectionToken<BehaviorSubject<string>>('THEME');

/**
 * Tema por defecto de la aplicación
 */
export const THEME_DEFAULT = new InjectionToken<string>('THEME_DEFAULT');

/**
 * Identificador usado para almacenar el tema
 */
export const THEME_LIST = new InjectionToken<string[]>('THEME_LIST');

/**
 * Identificador usado para almacenar el tema
 */
export const THEME_STORAGE_KEY = new InjectionToken<string>('THEME_STORAGE_KEY');

/**
 * Tiempo de espera hasta cancelar la petición
 */
export const HTTP_REQUEST_TIMEOUT = new InjectionToken<number>('HTTP_REQUEST_TIMEOUT');

/**
 * Información del dispositivo
 */
export const DEVICE = new InjectionToken<BehaviorSubject<string>>('DEVICE');

/**
 * Identificador usado para almacenenar la información del dispositivo
 */
export const DEVICE_STORAGE_KEY = new InjectionToken<string>('DEVICE_STORAGE_KEY');

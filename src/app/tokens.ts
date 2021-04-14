import { InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Lang } from './shared/services/lang/lang';

/**
 * Exportamos algunos tokens de nuestros servicios compartidos
 */
export { API_HTTP_HEADERS, API_HTTP_TIMEOUT } from '@desarrollo_web/ng-services';

/**
 * Entorno de la aplicación
 */
export const APP_ENV = new InjectionToken<string>('APP_ENV');

/**
 * Versión de la aplicación
 */
export const APP_VERSION = new InjectionToken<string>('APP_VERSION');

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
 * Información del dispositivo
 */
export const DEVICE = new InjectionToken<BehaviorSubject<string>>('DEVICE');

/**
 * Identificador usado para almacenar la información del dispositivo
 */
export const DEVICE_STORAGE_KEY = new InjectionToken<string>('DEVICE_STORAGE_KEY');

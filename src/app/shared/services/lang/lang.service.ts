import { Inject, Injectable } from '@angular/core';
import { APIRequest } from '@desarrollo_web/ng-services';
import { TranslateService } from '@ngx-translate/core';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AUTH_DEFAULT_STOREID,
  DEVICE,
  LANG,
  LANG_DEFAULT,
  LANG_LIST,
  LANG_STORAGE_KEY
} from '~/tokens';
import { API400Service } from '../api/api400.service';
import { Device } from '../device/device';
import { GetLangs, Lang } from './lang';

@Injectable({
  providedIn: 'root'
})
export class LangService {

  constructor(
    private api400Service: API400Service,
    private translateService: TranslateService,
    private logger: NGXLogger,
    @Inject(AUTH_DEFAULT_STOREID) private defaultStoreId: number,
    @Inject(LANG) private lang: BehaviorSubject<Lang>,
    @Inject(LANG_LIST) private langList: BehaviorSubject<Lang[]>,
    @Inject(LANG_DEFAULT) private langDefault: string,
    @Inject(LANG_STORAGE_KEY) private langStorageKey: string,
    @Inject(DEVICE) private device: BehaviorSubject<Device>,
  ) {

    this.translateService.setDefaultLang(this.langDefault);

    this.lang.subscribe(value => {
      this.logger.debug('Language changed', value);
    });
  }

  getPreferredLang(): Lang {
    const langList = this.langList.getValue();
    if (langList.length === 0) {
      return null;
    }

    const currLang = localStorage.getItem(this.langStorageKey);
    if (currLang) {
      return langList.find(lang => lang.idiomajs === currLang);
    }
    return langList[0];
  }

  setLang(lang: Lang): void {
    localStorage.setItem(this.langStorageKey, lang.idiomajs);
    this.translateService.use(lang.idiomajs);
    this.lang.next(lang);
  }

  setLanguages(langs: Lang[]): void {
    this.langList.next(langs);
  }

  getLanguages(): Observable<GetLangs> {
    const device = this.device.getValue();
    if (!device) {
      return of(null);
    }

    const programa = 'CONSPGM02';
    const area = 'SHOP';
    const params = {
      datos: {
        programa,
        area,
        version: 0,
        body: {
          tienda: this.defaultStoreId,
          tip_dev: device.tip_dev,
          cod_dev: device.cod_dev,
          uid_dev: device.uid_dev,
        }
      }
    };

    const request = new APIRequest(`${area}/${programa}`, params, GetLangs);
    request.isLogin = false;

    return this.api400Service.post<GetLangs>(request)
      .pipe(
        map(data => {
          if (data.allOk()) {
            this.setLanguages(data.datos.idiomas);
          }

          return data;
        }),
      );
  }

}

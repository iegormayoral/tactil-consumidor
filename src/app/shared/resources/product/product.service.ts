import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AUTH_DEFAULT_STOREID, LANG } from '../../../tokens';
import { API400Service } from '../../services';
import { ApiPost } from '../../services/api/classes/Api';
import { Lang } from '../../services/lang/classes/GetLangs';
import { GetProduct } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private api400Service: API400Service,
    @Inject(AUTH_DEFAULT_STOREID) private defaultStoreId: number,
    @Inject(LANG) private lang: BehaviorSubject<Lang>
  ) { }

  getByBarcode(barcode: string): Observable<GetProduct> {
    const area = 'SHOP';
    const programa = 'CONSPGM03';
    const params = {
      datos: {
        programa,
        area,
        version: 0,
        body: {
          tienda: this.defaultStoreId,
          idioma: this.lang.getValue().idioma,
          codbar: barcode,
          tip_dev: 'P',
          cod_dev: 1,
          uid_dev: '@PRUEBAS@D6D1A5E98E10004AC1DA88E8000000000000000D533877159F4BA10',
        }
      }
    };

    const req = new ApiPost(`${area}/${programa}`, JSON.stringify(params), GetProduct);
    return this.api400Service.post(req);
  }
}

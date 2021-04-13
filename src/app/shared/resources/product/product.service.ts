import { Inject, Injectable } from '@angular/core';
import { APIRequest } from '@desarrollo_web/ng-services';
import { BehaviorSubject, Observable } from 'rxjs';
import { AUTH_DEFAULT_STOREID, DEVICE, LANG } from '~/tokens';
import { API400Service } from '../../services';
import { Device } from '../../services/device/device';
import { Lang } from '../../services/lang/lang';
import { GetProduct } from './product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private api400Service: API400Service,
    @Inject(AUTH_DEFAULT_STOREID) private defaultStoreId: number,
    @Inject(LANG) private lang: BehaviorSubject<Lang>,
    @Inject(DEVICE) private device: BehaviorSubject<Device>
  ) { }

  getByBarcode(barcode: string): Observable<GetProduct> {
    const device = this.device.getValue();

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
          tip_dev: device.tip_dev,
          cod_dev: device.cod_dev,
          uid_dev: device.uid_dev,
        }
      }
    };

    const request = new APIRequest(`${area}/${programa}`, params, GetProduct);
    return this.api400Service.post(request);
  }
}

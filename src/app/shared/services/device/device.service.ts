import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AUTH_DEFAULT_STOREID, DEVICE, DEVICE_STORAGE_KEY } from '~/tokens';
import { API400Service } from '../api/api400.service';
import { APIPost } from '../api/classes/api';
import { CheckDevice, Device, DeviceInfo, RegisterDevice } from './device';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(
    private api400Service: API400Service,
    private electronService: ElectronService,
    private logger: NGXLogger,
    private router: Router,
    @Inject(DEVICE) public device: BehaviorSubject<Device>,
    @Inject(DEVICE_STORAGE_KEY) public deviceStorageKey: string,
    @Inject(AUTH_DEFAULT_STOREID) public defaultStoreId: number,
  ) {

    this.device.subscribe(val => {
      this.logger.debug('Device changed', val);
    });
  }

  checkOrRedirect(): Observable<boolean> {

    return this.getInfo()
      .pipe(
        mergeMap((deviceInfo) => {

          const device = this.device.value;
          device.info_dev = deviceInfo;
          this.device.next(device);

          return this.check();
        }),
        map((registered) => {
          if (!registered) {
            this.router.navigate(['device', 'register']);
          }
          return registered;
        }),
      );
  }

  register(storeId: number, deviceCode: number, deviceType: string, force = false): Observable<boolean> {
    const device = this.device.value;

    this.logger.log(`Registering device (storeId: ${storeId}, deviceCode: ${deviceCode}, deviceModel: ${device.info_dev.model})`);

    const programa = 'REGPGM00';
    const area = 'SHOP';
    const params = {
      datos: {
        programa,
        area,
        version: 0,
        body: {
          tienda: storeId,
          tip_dev: deviceType,
          cod_dev: deviceCode,
          forzarc: force ? 'S' : 'N',
          dev_modelo: device.info_dev.model,
        }
      }
    };

    const apiPost = new APIPost(`${area}/${programa}`, params, RegisterDevice);
    return this.api400Service.post<RegisterDevice>(apiPost)
      .pipe(
        mergeMap(data => {
          if (!data.allOk()) {
            return throwError(data);
          }

          const device = this.device.value;
          device.uid_dev = data.datos.uid_dev;
          device.storeId = storeId;
          this.device.next(device);

          this.saveDevice();

          return of(data.allOk());
        }),
        catchError((err: Response) => {
          this.logger.error('An error has ocurred while registering this device', err);
          return throwError(err);
        }),
      );
  }

  check(): Observable<boolean> {
    const device = this.getStoredDevice();
    if (!device) {
      this.logger.debug('There is no information stored for this device');
      return of(false);
    }

    console.log('yep', device);

    const programa = 'REGPGM01';
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

    const apiPost = new APIPost(`${area}/${programa}`, params, CheckDevice);
    return this.api400Service.post<CheckDevice>(apiPost)
      .pipe(
        map(data => data.allOk()),
        catchError((err: Response) => {
          this.logger.error('An error has ocurred while checking this device', err);
          return of(false);
        }),
      );
  }

  getStoredDevice(): Device {
    let data = localStorage.getItem(this.deviceStorageKey);
    if (data) {
      try {
        data = JSON.parse(data);
        return this.api400Service.deserializeJSON(data, Device);
      } catch(e) {
        // eslint-disable-line no-empty
      }
    }
    return null;
  }

  saveDevice(): void {
    localStorage.setItem(this.deviceStorageKey, JSON.stringify(this.device.value));
  }

  getInfo(): Observable<DeviceInfo> {
    const $promise = this.electronService.ipcRenderer.invoke('deviceInfo');
    return from($promise)
      .pipe(
        map(data => this.api400Service.deserializeJSON(data, DeviceInfo)),
        catchError((err: Response) => {
          this.logger.error('An error has ocurred while retrieving the device information', err);
          return of(null);
        }),
      );
  }

}

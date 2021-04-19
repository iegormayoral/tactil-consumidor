import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { APIRequest, APIService } from '@desarrollo_web/ng-services';
import { ElectronService } from 'ngx-electron';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject, from, Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { AUTH_DEFAULT_STOREID, DEVICE, DEVICE_STORAGE_KEY } from '~/tokens';
import { CheckDevice, Device, DeviceInfo, RegisterDevice } from './device';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(
    private api: APIService,
    private logger: NGXLogger,
    private router: Router,
    private electronService: ElectronService,
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

          const device = this.device.getValue();
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
    const device = this.device.getValue();

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
        }
      }
    };

    const request = new APIRequest(`${area}/${programa}`, params, RegisterDevice);
    return this.api.post<RegisterDevice>(request)
      .pipe(
        mergeMap(data => {
          if (!data.allOk()) {
            return throwError(data);
          }

          const device = this.device.getValue();
          device.uid_dev = data.datos.uid_dev;
          device.storeId = storeId;
          device.cod_dev = deviceCode;
          device.tip_dev = deviceType;
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
    const storedDevice = this.getStoredDevice();
    if (!storedDevice) {
      this.logger.debug('There is no information stored for this device');
      return of(false);
    }

    const programa = 'REGPGM01';
    const area = 'SHOP';
    const params = {
      datos: {
        programa,
        area,
        version: 0,
        body: {
          tienda: this.defaultStoreId,
          tip_dev: storedDevice.tip_dev,
          cod_dev: storedDevice.cod_dev,
          uid_dev: storedDevice.uid_dev,
        }
      }
    };

    const request = new APIRequest(`${area}/${programa}`, params, CheckDevice);
    return this.api.post<CheckDevice>(request)
      .pipe(
        map(data => {
          if (data.allOk()) {
            const device = this.device.getValue();
            storedDevice.info_dev = device.info_dev;
            this.device.next(storedDevice);
          }

          return data.allOk();
        }),
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
        return this.api.deserializeJSON(data, Device);
      } catch(e) {
        // eslint-disable-line no-empty
      }
    }
    return null;
  }

  saveDevice(): void {
    const device = this.device.getValue();
    localStorage.setItem(this.deviceStorageKey, JSON.stringify(device));
  }

  getInfo(): Observable<DeviceInfo> {
    const $promise = this.electronService.ipcRenderer.invoke('deviceInfo');
    return from($promise)
      .pipe(
        map(data => this.api.deserializeJSON(data, DeviceInfo)),
        catchError((err: Response) => {
          this.logger.error('An error has ocurred while retrieving the device information', err);
          return of(null);
        }),
      );
  }

}

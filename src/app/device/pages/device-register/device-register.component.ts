import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { finalize } from 'rxjs/operators';

import { DeviceService } from '~/shared/services';
import { RegisterDevice } from '~/shared/services/device/device';
import { AUTH_DEFAULT_STOREID } from '~/tokens';

@Component({
  selector: 'app-device-register',
  templateUrl: './device-register.component.html',
  styleUrls: ['./device-register.component.scss']
})
export class DeviceRegisterComponent implements OnInit {

  public form: FormGroup;
  public validated = false;
  public loading = false;
  public alreadyRegistered = false;

  constructor(private logger: NGXLogger,
              private deviceService: DeviceService,
              private router: Router,
              @Inject(AUTH_DEFAULT_STOREID) public defaultStoreId: number) {
  }

  ngOnInit(): void {
    const device = this.deviceService.device.value;

    this.form = new FormGroup({
      // eslint-disable-next-line @typescript-eslint/unbound-method
      'storeId': new FormControl(this.defaultStoreId, Validators.required),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      'deviceType': new FormControl(device.info_dev.type, Validators.required),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      'deviceModel': new FormControl({ value: device.info_dev.model, disabled: true }, Validators.required),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      'deviceCode': new FormControl('1', Validators.required),
    });
  }

  submit($event: Event, force: boolean = false): void {
    $event.preventDefault();
    $event.stopPropagation();

    if (this.loading) {
      this.logger.debug('Can not re-submit while loading');
      return;
    }

    this.loading = true;
    this.validated = true;

    if (this.form.valid) {
      const storeId = this.form.get('storeId').value,
        deviceCode = parseInt(this.form.get('deviceCode').value),
        deviceType = this.form.get('deviceType').value;

      const $register = this.deviceService.register(storeId, deviceCode, deviceType, force)
        .pipe(finalize(() => this.loading = false));

      $register.subscribe(
        registered => {

          if (registered) {
            this.router.navigate(['home']);
          }
        },
        (registerDevice: RegisterDevice) => {

          if (registerDevice.errorCode === 88888) {
            this.alreadyRegistered = true;
          }
        }
      );
    }
    else {
      this.loading = false;
    }
  }
}

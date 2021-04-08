import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DeviceComponent } from '~/device/device.component';
import { DeviceRegisterComponent } from '~/device/pages';
import { SharedModule } from '~/shared/shared.module';



@NgModule({
  declarations: [
    DeviceComponent,
    DeviceRegisterComponent,
  ],
  imports: [
    // Angular modules
    CommonModule,
    RouterModule,
    ReactiveFormsModule,

    // App modules
    SharedModule,
  ]
})
export class DeviceModule { }

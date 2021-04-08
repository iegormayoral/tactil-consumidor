import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeviceRegisterComponent } from './pages';
import { DeviceComponent } from './device.component';

const routes: Routes = [
  {
    path: 'device',
    component: DeviceComponent,
    children: [
      {
        path: 'register',
        component: DeviceRegisterComponent
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceRoutingModule { }

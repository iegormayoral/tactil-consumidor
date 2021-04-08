import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardRoutingModule } from './dashboard/dashboard-routing.module';
import { DeviceRoutingModule } from './device/device-routing.module';
import { PageNotFoundComponent } from './shared/components';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    DashboardRoutingModule,
    DeviceRoutingModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

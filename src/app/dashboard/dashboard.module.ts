import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbCarouselModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { BarcodeModalComponent, QrModalComponent } from '~/dashboard/components';
import { SharedModule } from '~/shared/shared.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardHomeComponent, DashboardProductComponent } from './pages';



@NgModule({
  declarations: [
    DashboardComponent,
    DashboardHomeComponent,
    DashboardProductComponent,
    BarcodeModalComponent,
    QrModalComponent,
  ],
  imports: [
    // Angular modules
    CommonModule,
    RouterModule,
    ReactiveFormsModule,

    // Package modules
    IvyCarouselModule,
    NgbCarouselModule,
    NgbTooltipModule,

    // App modules
    SharedModule,
  ]
})
export class DashboardModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  NgbAccordionModule,
  NgbCarouselModule,
  NgbDropdownModule,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { SharedModule } from '../../shared/shared.module';
import { ProductComponent } from './product.component';
import { QrModalComponent } from './components';


@NgModule({
  declarations: [ProductComponent, QrModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    NgbCarouselModule,
    NgbDropdownModule,
    NgbAccordionModule,
    NgbTooltipModule,
    IvyCarouselModule,
  ]
})
export class ProductModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { HomeComponent } from './home.component';
import { SharedModule } from '../../shared/shared.module';
import { BarcodeModalComponent } from './components';

@NgModule({
  declarations: [HomeComponent, BarcodeModalComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule]
})
export class HomeModule {}

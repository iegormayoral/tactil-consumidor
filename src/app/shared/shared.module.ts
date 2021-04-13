import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import {
  PageNotFoundComponent,
  HeaderComponent,
  LangSelectorComponent,
  ModalComponent,
  QRComponent,
  SpinnerComponent,
} from './components';
import { WebviewDirective, RippleDirective } from './directives';
import { PricePipe } from './pipes';
import { ProductService } from './resources';
import {
  API400Service,
  LangService,
  LoginService,
  ThemeService,
} from './services';



@NgModule({
  imports: [CommonModule, BrowserAnimationsModule, TranslateModule, FormsModule, RouterModule, ToastrModule.forRoot()],
  declarations: [
    WebviewDirective,
    RippleDirective,
    PricePipe,
    PageNotFoundComponent,
    HeaderComponent,
    LangSelectorComponent,
    ModalComponent,
    QRComponent,
    SpinnerComponent,
  ],
  exports: [
    TranslateModule,
    FormsModule,
    PricePipe,
    WebviewDirective,
    RippleDirective,
    HeaderComponent,
    LangSelectorComponent,
    ModalComponent,
    QRComponent,
    SpinnerComponent,
  ],
  providers: [
    LoginService,
    API400Service,
    LoginService,
    ThemeService,
    LangService,
    ProductService,
  ],
})
export class SharedModule {}

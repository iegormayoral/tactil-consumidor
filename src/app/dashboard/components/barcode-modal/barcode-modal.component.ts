import { Component, ElementRef, HostBinding, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { BehaviorSubject } from 'rxjs';
import { ModalComponent } from '~/shared/components';
import { ProductService } from '~/shared/resources';
import { API400Service } from '~/shared/services';
import { Lang } from '~/shared/services/lang/lang';
import { AUTH_DEFAULT_STOREID, LANG } from '~/tokens';


@Component({
  selector: 'app-barcode-modal',
  templateUrl: './barcode-modal.component.html',
  styleUrls: ['./barcode-modal.component.scss']
})
export class BarcodeModalComponent implements OnInit {

  @ViewChild('modal') modal: ModalComponent;
  @ViewChild('form') form: ElementRef;
  @ViewChild('input') input: ElementRef;

  public barcode: FormControl;
  public loading = false;
  public formExpanded = false;

  @HostBinding('class.has-error') error = null;

  constructor(
    private logger: NGXLogger, private router: Router,
    private api400Service: API400Service,
    private productService: ProductService,
    @Inject(AUTH_DEFAULT_STOREID) private defaultStoreId: number,
    @Inject(LANG) private lang: BehaviorSubject<Lang>) { }

  ngOnInit(): void {
    // FIXME: Mostramos un código de barras por defecto para probar
    this.barcode = new FormControl('8445054585516');
  }

  onSubmit($event: Event): void {
    $event.preventDefault();

    this.logger.debug('BarcodeModal submitted');
    this.form.nativeElement.reportValidity();

    const barcode: string = this.barcode.value;
    if (barcode.length === 0) {
      this.input.nativeElement.focus();
      return;
    }

    this.loading = true;

    this.productService.getByBarcode(barcode)
      .subscribe(
        data => {
          this.loading = false;

          if (!data.allOk()) {
            this.logger.info(data.errorMessage);
            this.error = data.errorMessage;
            return;
          }

          this.router.navigate(['product', barcode]);
        },
        err => {
          this.logger.error(`Can't validate the provided barcode ${barcode}`, err);
          this.loading = false;
          this.error = err.errorMessage;
        }
      );
  }

  open(): void {
    this.modal.open();

    this.input.nativeElement.focus();
  }

  expandForm(): void {
    this.formExpanded = !this.formExpanded;

    if (this.formExpanded) {
      setTimeout(() => this.input.nativeElement.focus(), 0);
    }
  }
}

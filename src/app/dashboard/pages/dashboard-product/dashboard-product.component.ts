import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ElectronService } from 'ngx-electron';
import { NGXLogger } from 'ngx-logger';
import { ModalComponent } from '~/shared/components';
import { ProductService } from '~/shared/resources';
import { Product, ProductColor, ProductCombination } from '~/shared/resources/product/product';

type RouteParams = {
  barcode: string,
};

@Component({
  selector: 'app-dashboard-product',
  templateUrl: './dashboard-product.component.html',
  styleUrls: ['./dashboard-product.component.scss']
})
export class DashboardProductComponent implements OnInit {

  public loading = false;
  public barcode: string;
  public product: Product;

  public gallery: string[];
  public combinations: ProductCombination[];
  public colors: ProductColor[];

  @ViewChild('qrModal') public qrModal: ModalComponent;

  constructor(
    private logger: NGXLogger,
    private route: ActivatedRoute,
    private electronService: ElectronService,
    private productService: ProductService) { }

  ngOnInit(): void {

    this.route.params.subscribe((params: RouteParams) => {

      if (this.barcode === params.barcode) {
        return;
      }

      this.barcode = params.barcode;

      this.loadProduct();
    });
  }

  loadProduct(): void {
    this.loading = true;

    this.productService.getByBarcode(this.barcode)
      .subscribe(
        data => {

          this.loading = false;

          if (!data.allOk()) {
            this.logger.error(data.errorMessage);
            return;
          }

          this.product = data.datos;

          this.gallery = this.getGalleryCarousel();
          this.combinations = this.getCombinationsCarousel();
          this.colors = this.getColorsCarousel();
        },
        error => {
          this.loading = false;
        }
      );
  }

  openStoreLink(): void {
    this.electronService.shell.openExternal(this.product.urlECM);
  }

  getGalleryCarousel(): string[] {
    const basePath = this.product.imgpath;
    return this.product.imagenes
      .filter(path => path.includes(`-800-`))
      .map(path => basePath + path);
  }

  getColorsCarousel(): ProductColor[] {
    const items: ProductColor[] = [];

    const colores = this.product.colores;
    for (let i = 0; i < colores.length; i++) {
      items.push(colores[i]);
    }

    return items;
  }

  getCombinationsCarousel(): ProductCombination[] {
    const items: ProductCombination[] = [];

    const combinations = this.product.combina;
    for (let i = 0; i < combinations.length; i++) {
      items.push(combinations[i]);
    }

    return items;
  }
}

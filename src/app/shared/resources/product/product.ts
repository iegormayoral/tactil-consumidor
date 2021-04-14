import { APIResponse } from '@desarrollo_web/ng-services';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('ProductColor')
export class ProductColor {
  @JsonProperty('codbar_color', String, false)
  codbar_color: string = undefined;

  @JsonProperty('colores_col', Number, false)
  colores_col: number = undefined;

  @JsonProperty('colores_desccol', String, false)
  colores_desccol: string = undefined;

  @JsonProperty('mota_color', String, false)
  mota_color: string = undefined;

  @JsonProperty('imgpath', String, false)
  imgpath: string = undefined;

  @JsonProperty('imagenes', [String], false)
  imagenes: string[] = undefined;
}

@JsonObject('ProductCombination')
export class ProductCombination {
  @JsonProperty('combart', Number, false)
  combart: number = undefined;

  @JsonProperty('combcol', Number, false)
  combcol: number = undefined;

  @JsonProperty('combdescart', String, false)
  combdescart: string = undefined;

  @JsonProperty('combdesccol', String, false)
  combdesccol: string = undefined;

  @JsonProperty('combpvp', Number, false)
  combpvp: number = undefined;

  @JsonProperty('combmoneda', String, false)
  combmoneda: string = undefined;

  @JsonProperty('imgpath', String, false)
  imgpath: string = undefined;

  @JsonProperty('imagenes', [String], false)
  imagenes: string[] = undefined;
}

@JsonObject('ProductComposition')
export class ProductComposition {
  @JsonProperty('pieza', String, false)
  pieza: string = undefined;

  @JsonProperty('html', String, false)
  html: string = undefined;
}

@JsonObject('ProductSize')
export class ProductSize {
  @JsonProperty('talla', String, false)
  talla: string = undefined;

  @JsonProperty('codbar_talla', String, false)
  codbar_talla: string = undefined;
}

@JsonObject('Product')
export class Product {
  @JsonProperty('codbar', String, false)
  codbar: string = undefined;

  @JsonProperty('articulo', Number, false)
  articulo: number = undefined;

  @JsonProperty('color', Number, false)
  color: number = undefined;

  @JsonProperty('talla', String, false)
  talla: string = undefined;

  @JsonProperty('descart', String, false)
  descart: string = undefined;

  @JsonProperty('desccol', String, false)
  desccol: string = undefined;

  @JsonProperty('pvp', Number, false)
  pvp: number = undefined;

  @JsonProperty('moneda', String, false)
  moneda: string = undefined;

  @JsonProperty('tallaje', [ProductSize], false)
  tallaje: ProductSize[] = undefined;

  @JsonProperty('composicion', [ProductComposition], false)
  composicion: ProductComposition[] = undefined;

  @JsonProperty('imgpath', String, false)
  imgpath: string = undefined;

  @JsonProperty('imagenes', [String], false)
  imagenes: string[] = undefined;

  @JsonProperty('combina', [ProductCombination], false)
  combina: ProductCombination[] = undefined;

  @JsonProperty('colores', [ProductColor], false)
  colores: ProductColor[] = undefined;

  @JsonProperty('urlECM', String, false)
  _urlECM: string = undefined;

  // FIXME: El protocolo debería venir indicado en la propia respuesta.
  get urlECM(): string {
    return 'https://' + this._urlECM;
  }

  getColors(): ProductColor[] {
    return this.colores.map(color => {
      const filteredColor = color;
      filteredColor.imagenes = filteredColor.imagenes.filter(path => path.includes('-140-'));
      return filteredColor;
    });
  }
}

@JsonObject('GetProduct')
export class GetProduct extends APIResponse {
  @JsonProperty('datos', Product, true)
  datos: Product = undefined;
}

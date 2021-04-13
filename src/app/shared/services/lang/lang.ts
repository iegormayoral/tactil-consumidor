import { JsonObject, JsonProperty } from 'json2typescript';
import { JsonToObject } from '~/shared/services/api/classes/JsonToObject';

@JsonObject('Lang')
export class Lang {
  @JsonProperty('idioma', String, false)
  idioma: string = undefined;

  @JsonProperty('idiomajs', String, false)
  idiomajs: string = undefined;

  @JsonProperty('descri', String, false)
  descri: string = undefined;

  @JsonProperty('bandera', String, false)
  bandera: string = undefined;
}

@JsonObject('Langs')
export class Langs {
  @JsonProperty('idiomas', [Lang], false)
  idiomas: Lang[] = undefined;
}

@JsonObject('GetLangs')
export class GetLangs extends JsonToObject {
  @JsonProperty('datos', Langs, true)
  datos: Langs = undefined;
}

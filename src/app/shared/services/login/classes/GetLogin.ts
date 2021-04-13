import { JsonObject, JsonProperty } from 'json2typescript';
import { JsonToObject } from '~/shared/services/api/classes/JsonToObject';
import { JwtLogin } from './JwtLogin';

@JsonObject('GetLogin')
export class GetLogin extends JsonToObject {
  @JsonProperty('datos', JwtLogin, true)
  datos: JwtLogin = undefined;
}

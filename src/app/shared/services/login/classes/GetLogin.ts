import { JsonObject, JsonProperty } from 'json2typescript';
import { JsonToObject } from '../../api/api.service';
import { JwtLogin } from './JwtLogin';

@JsonObject('GetLogin')
export class GetLogin extends JsonToObject {
  @JsonProperty('datos', JwtLogin, true)
  datos: JwtLogin = undefined;
}

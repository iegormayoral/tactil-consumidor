import { JsonObject, JsonProperty } from 'json2typescript';
import { JsonToObject } from '../api.service';
import { JwtLogin } from '../../login/classes/JwtLogin';

@JsonObject('JWTRefresh')
export class JWTRefresh extends JsonToObject{
  @JsonProperty('datos', JwtLogin, true)
  datos: JwtLogin = undefined;
}

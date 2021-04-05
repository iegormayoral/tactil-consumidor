import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('JwtLogin')
export class JwtLogin {
  @JsonProperty('jwt', String)
  jwt: string = undefined;

  @JsonProperty('jwtrefresh', String)
  jwtrefresh: string = undefined;
}

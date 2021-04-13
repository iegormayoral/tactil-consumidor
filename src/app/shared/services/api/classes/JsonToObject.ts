import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('JsonToObject')
export class JsonToObject {
  // {"errorCode":101,"errorMessage":""}
  // This maps the value of the JSON key "name" to the class property "name".
  // If the JSON value is not of type string (or missing), there will be an exception.

  @JsonProperty("errorCode", Number)
  errorCode: number = undefined;

  @JsonProperty("errorMessage", String)
  errorMessage: string = undefined;

  /**
   * funcion que indica si ha ido bien el parseo de los datos
   * @returns {boolean}
   */
  public allOk(): boolean {
    return this.errorCode === 0;
  }

  public getErrorMessage():string{
    return this.errorMessage;
  }
}

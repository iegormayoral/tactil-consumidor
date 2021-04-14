import { APIResponse } from '@desarrollo_web/ng-services';
import { JsonObject, JsonProperty } from 'json2typescript';

@JsonObject('DeviceInfo')
export class DeviceInfo {
  @JsonProperty('manufacturer', String)
  manufacturer: string = undefined;

  @JsonProperty('model', String)
  model: string = undefined;

  @JsonProperty('name', String)
  name: string = undefined;

  @JsonProperty('type', String)
  get type(): string {
    let type = '';

    // Si el puntero del dispositivo tiene una precisión baja
    // asumimos que es de tipo "pantalla".
    if (window.matchMedia('(pointer: coarse)').matches) {
      type = 'P';
    }

    return type;
  }
}

@JsonObject('Device')
export class Device {
  @JsonProperty('tip_dev', String)
  tip_dev: string = undefined;

  @JsonProperty('cod_dev', Number)
  cod_dev: number = undefined;

  @JsonProperty('uid_dev', String)
  uid_dev: string = undefined;

  @JsonProperty('info_dev', DeviceInfo)
  info_dev: DeviceInfo = undefined;

  @JsonProperty('storeId', Number)
  storeId: number = undefined;
}

@JsonObject('DeviceId')
export class DeviceId {
  @JsonProperty('uid_dev', String)
  uid_dev: string = undefined;
}

@JsonObject('RegisterDevice')
export class RegisterDevice extends APIResponse {
  @JsonProperty('datos', DeviceId, true)
  datos: DeviceId = undefined;
}

@JsonObject('CheckDevice')
export class CheckDevice extends APIResponse {
  // ..
}

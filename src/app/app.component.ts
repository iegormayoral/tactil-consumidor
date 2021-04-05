import { Component, Inject } from '@angular/core';
import { APP_VERSION } from './tokens';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    @Inject(APP_VERSION) public appVersion: string,
  ) { }

}

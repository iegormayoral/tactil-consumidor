import { Component, Input, OnInit } from '@angular/core';
import { AwesomeQR, Options as QROptions } from 'awesome-qr';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss']
})
export class QRComponent implements OnInit {

  @Input() text = '';
  @Input() size = 370;
  @Input() themed = false;

  public image: string | ArrayBuffer | Buffer = '';

  constructor() { }

  ngOnInit(): void {
    const opts: QROptions = {
      text: this.text,
      size: this.size,
      margin: 5,
      logoMargin: 0,
      logoScale: 0.25,
      components: {
        data: {
          scale: 0.6,
        },
      }
    };

    if (this.themed) {
      const computedStyle = this.getComputedStyles();
      const logoDataURL = computedStyle.getPropertyValue('--icon-primary-base64')
        .replace(/['|"]/g, '')
        .replace(/['|"]/g, '');

      opts.colorDark = computedStyle.getPropertyValue('--primary');
      opts.logoImage = logoDataURL;
    }

    const qr = new AwesomeQR(opts);

    qr.draw().then(dataURL => {
      this.image = dataURL;
    });
  }

  getComputedStyles(): CSSStyleDeclaration {
    return getComputedStyle(document.documentElement);
  }

}

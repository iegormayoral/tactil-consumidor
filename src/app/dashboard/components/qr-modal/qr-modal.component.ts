import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from '~/shared/components';

@Component({
  selector: 'app-qr-modal',
  templateUrl: './qr-modal.component.html',
  styleUrls: ['./qr-modal.component.scss']
})
export class QrModalComponent implements OnInit {

  @Input() text = '';
  @ViewChild('modal') modal: ModalComponent;

  constructor() { }

  ngOnInit(): void { }

  open(): void {
    this.modal.open();
  }

}

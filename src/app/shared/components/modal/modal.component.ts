import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent implements OnInit {

  @Input() title: string = null;
  @Input() hasHeader = true;

  public opened = false;

  constructor() { }

  ngOnInit(): void { }

  open(): void {
    this.opened = true;
  }

  close(): void {
    this.opened = false;
  }

}

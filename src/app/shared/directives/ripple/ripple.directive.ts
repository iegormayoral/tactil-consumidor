import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ripple]'
})
export class RippleDirective {

  private readonly hostEl: any;

  constructor(private renderer: Renderer2, el: ElementRef) {
    this.hostEl = el.nativeElement;
  }

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent): void {
    let ink: HTMLElement;

    if (this.hostEl.querySelector('.ripple') === null) {
      ink = this.renderer.createElement('span');
      this.renderer.addClass(ink, 'ripple');
      this.renderer.appendChild(this.hostEl, ink);
    }

    ink = this.hostEl.querySelector('.ripple');
    this.renderer.appendChild(this.hostEl, ink);
    this.renderer.removeClass(ink, 'animate');

    if (!ink.offsetHeight && !ink.offsetWidth) {
      const d = Math.max(this.hostEl.offsetWidth, this.hostEl.offsetHeight);
      this.renderer.setStyle(ink, 'width', `${d}px`);
      this.renderer.setStyle(ink, 'height', `${d}px`);
    }

    const x = $event.pageX - this.hostEl.offsetLeft - ink.offsetWidth / 2;
    const y = $event.pageY - this.hostEl.offsetTop - ink.offsetHeight / 2;

    this.renderer.setStyle(ink, 'top', `${y}px`);
    this.renderer.setStyle(ink, 'left', `${x}px`);
    this.renderer.addClass(ink, 'animate');
  }

}

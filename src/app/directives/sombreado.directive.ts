import { Directive, ElementRef, Renderer, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[appSombreado]'
})
export class SombreadoDirective implements OnInit {

  estadoConsultorio: string;
  @Input() set appSombreado(estadoConsultorio: any) {
    this.estadoConsultorio = estadoConsultorio;
  }

  constructor(public el: ElementRef,
              public rederer: Renderer) { }


    ngOnInit() {
      if (this.estadoConsultorio === 'Libre') {
        this.rederer.setElementStyle(this.el.nativeElement, 'background-color', 'aquamarine');
      } else if (this.estadoConsultorio === 'Ocupado') {
        this.rederer.setElementStyle(this.el.nativeElement, 'background-color', 'rgba(199, 97, 97, 0.500)');
      }

    }

}

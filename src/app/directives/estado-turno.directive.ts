import { Directive, ElementRef, Renderer, OnInit, Input, Renderer2 } from '@angular/core';
import { EstadoTurno } from '../classes/turno';

@Directive({
  selector: '[appEstadoTurno]'
})
export class EstadoTurnoDirective implements OnInit {

  estadoTurno: EstadoTurno;
  @Input() set appEstadoTurno(estadoTurno: EstadoTurno) {
    this.estadoTurno = estadoTurno;
  }

  constructor(public el: ElementRef,
              // tslint:disable-next-line: deprecation
              public renderer: Renderer2) { }


    ngOnInit() {
      if (this.estadoTurno === EstadoTurno.Cancelado) {
        this.renderer.addClass(this.el.nativeElement, 'far fa-calendar-times text-danger mr-3');
        this.renderer.removeClass(this.el.nativeElement, 'far fa-calendar-plus text-success mr-3');



        // this.el.nativeElement.innerText = 'far fa-calendar-times text-danger mr-3';
      } else if (this.estadoTurno === EstadoTurno.Pendiente) {
        this.renderer.addClass(this.el.nativeElement, 'far fa-calendar-plus text-success mr-3');

       }

    }

    // no funca
}


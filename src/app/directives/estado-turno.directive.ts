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
              public renderer: Renderer2) { }


    ngOnInit() {
      switch (this.estadoTurno) {
        case(EstadoTurno.Pendiente):
          this.renderer.addClass(this.el.nativeElement, 'pendiente');
          break;
        case(EstadoTurno.Cancelado):
          this.renderer.addClass(this.el.nativeElement, 'cancel');
          break;
        case(EstadoTurno.Finalizado):
          this.renderer.addClass(this.el.nativeElement, 'finalizado');
          break;
      }
    }
}


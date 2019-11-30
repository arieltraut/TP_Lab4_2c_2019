import { Directive, ElementRef, Renderer, OnInit, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appUpDownComment]'
})
export class UpDownCommentDirective  implements OnInit {

  puntuacion: number;

  @Input() set appUpDownComment(puntuacionEsp: number) {
    this.puntuacion = puntuacionEsp;
    // console.log(this.puntuacion);
  }

  constructor(public el: ElementRef,
              public renderer2: Renderer2 ) { }


  ngOnInit() {
    if (this.puntuacion >= 6) {
      this.renderer2.addClass(this.el.nativeElement, 'fa');
      this.renderer2.addClass(this.el.nativeElement, 'fa-arrow-up');
      this.renderer2.addClass(this.el.nativeElement, 'pendiente');
      // this.renderer.setElementClass(this.el.nativeElement, 'fa fa-arrow-up', true );
      // this.renderer.removeClass(this.el.nativeElement, 'far fa-calendar-plus text-success mr-3');

    // this.el.nativeElement.innerText = 'far fa-calendar-times text-danger mr-3';
    } else if (this.puntuacion <= 5) {
      this.renderer2.addClass(this.el.nativeElement, 'fas');
      this.renderer2.addClass(this.el.nativeElement, 'fa-arrow-down');
      this.renderer2.addClass(this.el.nativeElement, 'cancel');
    }

  }



}

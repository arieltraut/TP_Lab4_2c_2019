import { Component, OnInit } from '@angular/core';
import { FirebaseBdService } from 'src/app/services/firebase-bd.service';
import { Observable } from 'rxjs/internal/Observable';
import { TurnoInterface } from 'src/app/classes/turno';


@Component({
  selector: 'app-recepcion',
  templateUrl: './recepcion.component.html',
  styleUrls: ['./recepcion.component.css']
})
export class RecepcionComponent implements OnInit {

  isLoading = false;
  listadoObservable: Observable<any[]>;
  listadoConsultorios: Array<any>;
  turnos: Array<TurnoInterface>;
  proximo: string;

  cards = {
    libres: 0,
    total: 0,
    ocupados: 0,
  };



  constructor(private bd: FirebaseBdService) { }

  ngOnInit() {
    this.TraerTurnos();
    this.ObtenerConsultorios();
  }

  ProximoADesocuparse() {
    const ocupados = this.listadoConsultorios.filter(consul => consul.Estado === 'Ocupado');
    // const consul002 = this.turnos.find(t => t.Consultorio === '002');
    // const consul101 = this.turnos.find(t => t.Consultorio === '101');
    // const consul102 = this.turnos.find(t => t.Consultorio === '102');
    // const consul201 = this.turnos.find(t => t.Consultorio === '201');

    // const array
    console.log(ocupados);

    const resultado = [];
    ocupados.forEach((consul) => {
      for (const turno of this.turnos) {
        if (turno.ConsultorioId === consul.id) {
          resultado.push(turno);
          break;
        }
      }
    });

    console.log(resultado);

    let min = resultado[0].Fecha;
    this.proximo = resultado[0].Consultorio;

    resultado.forEach((resultado: TurnoInterface) => {
      if ( resultado.Fecha < min ) {
        min = resultado.Fecha;
        this.proximo = resultado.Consultorio;
       }
    });

    // console.log(min);
    console.log(this.proximo);
  }


  ObtenerConsultorios() {
    this.isLoading = true;
    this.listadoObservable = this.bd.TraerTodos('consultorios');
    this.listadoObservable.subscribe(x => {
      this.listadoConsultorios = x.sort((a, b) => a.Codigo - b.Codigo);
      this.obtenerCards(this.listadoConsultorios);
      this.isLoading = false;
      this.ProximoADesocuparse();
    });
  }

  obtenerCards(listado) {
    listado.forEach((consultorio: any) => {
        this.cards.total++;
        if (consultorio.Estado === 'Libre') {
          this.cards.libres++;
        } else if (consultorio.Estado === 'Ocupado') {
          this.cards.ocupados++;
        }
    });
  }

  TraerTurnos() {
    this.listadoObservable = this.bd.TraerTodos('turnos');
    this.listadoObservable.subscribe(turnos => {
        this.turnos = turnos.filter(x => x.Estado === 'Iniciado')
                            .sort((a, b) => new Date(a.Fecha).getTime() - new Date(b.Fecha).getTime());
      });
  }



}

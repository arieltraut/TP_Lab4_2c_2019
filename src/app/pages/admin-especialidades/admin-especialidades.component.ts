import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { FirebaseBdService } from 'src/app/services/firebase-bd.service';
import { TurnoInterface, EstadoTurno } from 'src/app/classes/turno';

@Component({
  selector: 'app-admin-especialidades',
  templateUrl: './admin-especialidades.component.html',
  styleUrls: ['./admin-especialidades.component.css']
})
export class AdminEspecialidadesComponent implements OnInit {

  constructor(private bd: FirebaseBdService) { }

  listadoObservable: Observable<any[]>;
  turnos: TurnoInterface[];
  comentarios: any[];

  // panelOpenState = false;
  usuarios;
  mejoresComentarios;
  peoresComentarios;
  masUsada;
  menosUsada;

  ngOnInit() {
    this.TraerTurnos();
  }



  cargarEspecialidades() {
    // especialidades: string[] = ['Cariologia', 'Ortodoncia', 'Implantologia', 'Radiologia'];
    const countCario = this.turnos.filter(x => x.Especialidad === 'Cariologia').length;
    const countOrt = this.turnos.filter(x => x.Especialidad === 'Ortodoncia').length;
    const countImpla = this.turnos.filter(x => x.Especialidad === 'Implantologia').length;
    const countRadio = this.turnos.filter(x => x.Especialidad === 'Radiologia').length;

    const especialidadMasUsada = Math.max(countCario, countOrt, countRadio, countImpla);

    switch (especialidadMasUsada) {
      case countCario:
        this.masUsada = 'Cariologia';
        break;
      case countOrt:
        this.masUsada = 'Ortodoncia';
        break;
      case countImpla:
        this.masUsada = 'Implantologia';
        break;
      case countRadio:
        this.masUsada = 'Radiologia';
        break;
    }

    const especialidadMenosUsada = Math.min(countCario, countOrt, countRadio, countImpla);

    switch (especialidadMenosUsada) {
      case countCario:
        this.masUsada = 'Cariologia';
        break;
      case countOrt:
        this.masUsada = 'Ortodoncia';
        break;
      case countImpla:
        this.masUsada = 'Implantologia';
        break;
      case countRadio:
        this.masUsada = 'Radiologia';
        break;
    }
  }

  cargarComentarios() {
    this.mejoresComentarios = [];
    this.peoresComentarios = [];

    // const turnosEncuestados = this.turnos.filter(x => x.Estado === EstadoTurno.Finalizado && x.Encuesta != null);

    // if (turnosEncuestados.length > 0) {
    //   const puntuacionesEsp = turnosEncuestados.map((obj) => {
    //     return Number.parseInt(obj.Encuesta.PuntuacionEspecialista);
    //   });

    //   const maxValue = Math.max(...puntuacionesEsp);
    //   const minValue = Math.min(...puntuacionesEsp);

    //   turnosEncuestados.forEach(element => {
    //     let comentario = {
    //       NombreCliente: "",
    //       Comentario: ""
    //     };

    //     if (Number.parseInt(element.Encuesta.PuntuacionEspecialista) == maxValue) {
    //       comentario.Comentario = element.Encuesta.Opinion;
    //       comentario.NombreCliente = element.NombreCliente;
    //       this.mejoresComentarios.push(comentario);
    //     }
    //     else if (Number.parseInt(element.Encuesta.PuntuacionEspecialista) == minValue) {
    //       comentario.Comentario = element.Encuesta.Opinion;
    //       comentario.NombreCliente = element.NombreCliente;
    //       this.peoresComentarios.push(comentario);
    //     }
    //   });
    // }
  }



  TraerTurnos() {
    this.listadoObservable = this.bd.TraerTodos('turnos');
    this.listadoObservable.subscribe(x => {
      this.turnos = x.filter(user => user.type === 'Cliente');
    });
  }

}

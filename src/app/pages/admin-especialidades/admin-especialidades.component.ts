import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { FirebaseBdService } from 'src/app/services/firebase-bd.service';
import { TurnoInterface, EstadoTurno } from 'src/app/classes/turno';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

  cards = {
    positivos: 0,
    negativos: 0,
    total: 0,
  };


  // panelOpenState = false;
  usuarios;
  mejoresYPeoresComentarios;
  masUsada;
  masPuntaje;
  menosUsada;
  menosPuntaje;
  maxValue;
  minValue;

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
        this.masPuntaje = countCario;
        break;
      case countOrt:
        this.masUsada = 'Ortodoncia';
        this.masPuntaje = countOrt;
        break;
      case countImpla:
        this.masUsada = 'Implantologia';
        this.masPuntaje = countImpla;
        break;
      case countRadio:
        this.masUsada = 'Radiologia';
        this.masPuntaje = countRadio;
        break;
    }

    const especialidadMenosUsada = Math.min(countCario, countOrt, countRadio, countImpla);

    switch (especialidadMenosUsada) {
      case countCario:
        this.menosUsada = 'Cariologia';
        this.menosPuntaje = countCario;
        break;
      case countOrt:
        this.menosUsada = 'Ortodoncia';
        this.menosPuntaje = countOrt;
        break;
      case countImpla:
        this.menosUsada = 'Implantologia';
        this.menosPuntaje = countImpla;
        break;
      case countRadio:
        this.menosUsada = 'Radiologia';
        this.menosPuntaje = countRadio;
        break;
    }

  }

  cargarComentarios() {
    this.mejoresYPeoresComentarios = [];

    const turnosEncuestados = this.turnos.filter(x => x.Estado === EstadoTurno.Finalizado && x.Encuesta != null);

    console.log(turnosEncuestados);

    if (turnosEncuestados.length > 0) {
      const puntuacionesEsp = turnosEncuestados.map((obj) => {
        return Number(obj.Encuesta.PuntuacionEspecialista);
      });

      this.mejoresYPeoresComentarios = turnosEncuestados.sort((a, b) => b.Encuesta.PuntuacionEspecialista
                                                        - a.Encuesta.PuntuacionEspecialista);

      this.obtenerCards(this.mejoresYPeoresComentarios);


      this.maxValue = Math.max(...puntuacionesEsp);
      this.minValue = Math.min(...puntuacionesEsp);


      // this.mejoresYPeoresComentarios = turnosEncuestados.filter(t => t.Encuesta.PuntuacionEspecialista === this.maxValue
      //                                                        || t.Encuesta.PuntuacionEspecialista === this.minValue)
      //                                                        .sort((a, b) => b.Encuesta.PuntuacionEspecialista
      //                                                         - a.Encuesta.PuntuacionEspecialista);

      // console.log(this.mejoresYPeoresComentarios);

      // **************************************************/
      // turnosEncuestados.forEach(element => {
      //   const comentario = {
      //     Especialidad: '',
      //     NombreCliente: '',
      //     Comentario: ''
      //   };

      //   if (Number(element.Encuesta.PuntuacionEspecialista === this.maxValue ||
      //              element.Encuesta.PuntuacionEspecialista) === this.minValue) {
      //     comentario.Comentario = element.Encuesta.Opinion;
      //     comentario.NombreCliente = element.NombreCliente;
      //     comentario.Especialidad = element.Especialidad;
      //     this.mejoresYPeoresComentarios.push(comentario);
      //   }
      // });
    }
  }




  TraerTurnos() {
    this.listadoObservable = this.bd.TraerTodos('turnos');
    this.listadoObservable.subscribe(turnos => {
      if (turnos) {
        this.turnos = turnos;
        this.cargarEspecialidades();
        this.cargarComentarios();
      }
    });
  }


  obtenerCards(listado) {
    listado.forEach((turno: TurnoInterface) => {
        this.cards.total++;
        if(turno.Encuesta.PuntuacionEspecialista >= 6) {
          this.cards.positivos++;
        } else {
          this.cards.negativos++;
        }
    });
  }

  descarga() {
    // this.eliminOK = false;
    const documentDefinition = { content: [
        {
            text: 'Encuesta',
            bold: true,
            fontSize: 20,
            alignment: 'center',
            decoration: 'underline',
            margin: [0, 0, 0, 20]
        },
        this.getListaEncuestaPDF(),
      ],
          styles: {
            name: {
              fontSize: 14,
            },
            jobTitle: {
              fontSize: 16,
              bold: true,
              italics: true
            }
          }
        };
    pdfMake.createPdf(documentDefinition).download('ListadoEncuesta.pdf');
  }

  getListaEncuestaPDF() {
    const exs = [];
    this.mejoresYPeoresComentarios.forEach(element => {
      exs.push(
        [{
          columns: [
            [{
              text: 'Especialista: ' + element.NombreEspecialista,
              style: 'jobTitle'
            },
            {
              text:  'Especialidad: ' + element.Especialidad,
              style: 'name'
            },
            {
              text:  'Cliente: ' + element.NombreCliente,
              style: 'name'
            },
            {
              text:  'Comentario: ' + element.Encuesta.Opinion,
              style: 'name'
            },
          ]
          ]
        }]
      );
    });
    return {
      table: {
        widths: ['*'],
        body: [
          ...exs
        ]
      }
    };
  }

}

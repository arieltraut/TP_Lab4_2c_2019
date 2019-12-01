import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/classes/user';
import { FirebaseBdService } from 'src/app/services/firebase-bd.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { TurnoInterface, EstadoTurno } from 'src/app/classes/turno';
import { Observable } from 'rxjs/internal/Observable';
import { EncuestaInterface } from 'src/app/classes/encuesta';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;



@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {
  clienteForm = new FormControl('', Validators.required);
  especialistaForm = new FormControl('', Validators.required);
  fechaForm = new FormControl('', Validators.required);
  fechaForm2 = new FormControl('');

  registerForm: FormGroup = this.formBuilder.group({
    fechaForm: this.fechaForm,
    especialistaForm: this.especialistaForm,
    clienteForm: this.clienteForm,
    fechaForm2: this.fechaForm2
  });


  usuario: User;
  listadoObservable: Observable<any[]>;
  especialistas: User[];  // ver disponibilidad especialistas funcion TraerEspecialistasPorFecha()
  clientes: User[];
  turnos: TurnoInterface[];
  opcionFiltroAdm = '';


  minDate = new Date(Date.now());
  // mostrar = true;

  constructor( private bd: FirebaseBdService,
               private formBuilder: FormBuilder ) {}

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('user-bd'));

    this.especialistas = [];
    this.clientes = [];
    this.turnos = [];
    this.TraerClientes();
    // this.TraerEspecialistas();
    this.TraerTurnos();

    if (this.usuario.type === 'Cliente' ) {
      // this.registerForm.value.clienteForm.setValue(this.usuario);
      this.registerForm.patchValue({clienteForm: this.usuario});
    }
  }


  FechaDenegada() {
    if (this.usuario.type === 'Cliente' || this.usuario.type === 'Recepcionista') {
      const date: Date = new Date(this.registerForm.value.fechaForm); // formato para comparar con variables date
      date.setDate(date.getDate() + 1);

      if (this.minDate > date) {
        Swal.fire({
          icon: 'error',
          title: 'Atencion',
          text: 'La fecha del turno no puede ser anterior al dia de hoy',
        });
        this.onReset();
        return;
      }
    }
  }


  CrearTurno() {
    this.bd.TraerTodos2('consultorios').then(consultorios => {
      console.log(consultorios);
      consultorios = consultorios.filter(consuLibre => consuLibre.Estado === 'Libre');

      if (consultorios.length < 1) {
        Swal.fire({
          icon: 'error',
          title: 'Atencion',
          text: 'Todos los consultorios estan ocupados, los especialistas deben finalizar los turnos iniciados',
        });
        return;
      }

      const consultorio = consultorios[Math.floor((Math.random() * 4))];
      const especialista: User = this.registerForm.value.especialistaForm;
      const cliente: User = this.registerForm.value.clienteForm;

      let creadoCliente = true;
      let UidRecepcionista = null;
      let NombreRecepcionista = null;

      if (this.usuario.type !== 'Cliente') {
        creadoCliente = false;
        UidRecepcionista = this.usuario.uid;
        NombreRecepcionista = this.usuario.displayName;
      }

      const turno: TurnoInterface = {
        UidCliente: cliente.uid,
        NombreCliente: cliente.displayName,
        UidEspecialista: especialista.uid,
        NombreEspecialista: especialista.displayName,
        Especialidad: especialista.especialidad,
        Fecha: this.registerForm.value.fechaForm,
        Estado: EstadoTurno.Pendiente,
        Encuesta: null,
        ObservacionesEspecialista: '',
        Consultorio: consultorio.Codigo,
        ConsultorioId: consultorio.id,
        CreadoPorCliente: creadoCliente,
        UidRecepcionista,
        NombreRecepcionista
      };

      this.bd.AgregarUno(turno, 'turnos');

      Swal.fire(
        'Se creó el turno con éxito!',
        `El turno será el día ${turno.Fecha} en el consultorio: ${turno.Consultorio}.`,
        'success'
      );

      this.onReset();
    });
  }



  onReset() {
    // this.submitted = false;
    this.registerForm.reset();
    this.registerForm.patchValue({especialistaForm: ''});
    this.registerForm.patchValue({clienteForm: ''});
    this.opcionFiltroAdm = '';
  }


  iniciarYCancelarTurno(turno: TurnoInterface) {
    Swal.fire({
      title: 'Que deseas hacer?',
      text: 'La accion no se puede revertir!',
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonText: 'Iniciar turno!',
      cancelButtonText: 'Cancelar turno!',
    }).then((result) => {
      if (result.value) {
        turno.Estado = EstadoTurno.Iniciado;
        console.log(turno);
        this.bd.ModificarUno(turno, 'turnos');
        this.bd.TraerUno(turno.ConsultorioId, 'consultorios').then(consultorio => {
          console.log(consultorio);
          consultorio.Estado = 'Ocupado';
          console.log(consultorio);
          this.bd.ModificarUno(consultorio, 'consultorios');
        });
        Swal.fire(
          'Iniciado!',
          'El turno ha sido iniciado, el paciente puede ingresar.',
          'success'
        );
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        turno.Estado = EstadoTurno.Cancelado;
        console.log(turno);
        this.bd.ModificarUno(turno, 'turnos');
        Swal.fire(
          'Cancelado!',
          'El turno ha sido cancelado.',
          'success'
        );
      }
    });
  }


  finalizarTurno(turno) {
    Swal.fire({
      title: 'Deseas finalizar el turno?',
      text: 'El cambio no se puede revertir!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, marcar finalizado!'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Finalizado!',
          'El turno ha sido completado.',
          'success'
        );
        Swal.fire({
          input: 'textarea',
          inputPlaceholder: 'Reseña de los trabajos realizados en el paciente...',
          inputAttributes: {
            'aria-label': 'Type your message here'
          },
          showCancelButton: true
        }).then((result) => {
            if (result) {
              turno.Estado = EstadoTurno.Finalizado;
              turno.ObservacionesEspecialista = result.value;
              this.bd.ModificarUno(turno, 'turnos');
              this.bd.TraerUno(turno.ConsultorioId, 'consultorios').then(consultorio => {
              consultorio.Estado = 'Libre';
              this.bd.ModificarUno(consultorio, 'consultorios');
              });
            }
        });
      }
    });
  }


  realizarEncuesta(turno) {
    const encuesta: EncuestaInterface = {
      NombreCliente: turno.NombreCliente,
      NombreEspecialista: turno.NombreEspecialista,
      UidCliente: turno.UidCliente,
      UidEspecialista: turno.UidEspecialista,
      PuntuacionClinica: 0,
      PuntuacionEspecialista: 0,
      Opinion: '',
    };

    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2', '3'],
      }).queue([
        {
          title: 'Que puntaje le darias a la Clinica?',
          input: 'select',
          inputOptions: {
            1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10',
          },
          inputPlaceholder: 'Selecciona puntaje',
          showCancelButton: true,
          inputValidator: (value) => {
            return new Promise((resolve) => {
              // if (value === 'oranges') {
              resolve();
              // } else {
              //   resolve('You need to select oranges :)')
              // }
            });
          }
        },
        {
          title: 'Y al especialista?',
          input: 'select',
          inputOptions: {
            1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10',
          },
          inputPlaceholder: 'Selecciona puntaje',
          showCancelButton: true,
          inputValidator: (value) => {
            return new Promise((resolve) => {
              resolve();
            });
          }
        },
        {
            input: 'textarea',
            inputPlaceholder: 'Describe tu experiencia en la clinica...',
            inputAttributes: {
              'aria-label': 'Type your message here'
            },
        }
      ]).then((result) => {
        if (result.value) {
          const answers = JSON.stringify(result.value);
          encuesta.PuntuacionClinica = Number(result.value[0]);
          encuesta.PuntuacionEspecialista = Number(result.value[1]);
          encuesta.Opinion = result.value[2];
          turno.Encuesta = encuesta;
          console.log(result.value);
          console.log(encuesta.PuntuacionClinica);
          console.log(encuesta.PuntuacionEspecialista);
          console.log(encuesta.Opinion);
          this.bd.ModificarUno(turno, 'turnos');

          Swal.fire({
            title: 'Muchas gracias!',
            html: `
              Tus respuestas:
              <pre><code>${answers}</code></pre>
            `,
            confirmButtonText: 'Volver!'
          });
        }
      });
  }

  MostrarEncuestaResenia(turno: TurnoInterface) {
    Swal.fire({
      icon: 'info',
      title: (this.usuario.type === 'Especialista') ? 'Opinion cliente:' : 'Observacion especialista:',
      text: (this.usuario.type === 'Especialista') ? turno.Encuesta.Opinion : turno.ObservacionesEspecialista,
    });
    // if (this.usuario.type === 'Especialista') {
    //   Swal.fire({
    //     icon: 'info',
    //     title: 'Observacion especialista:',
    //     text: turno.ObservacionesEspecialista,
    //   });
    // }
  }


  FiltroEspecialistaFecha() {
    if (this.usuario.type === 'Especialista') {
      this.listadoObservable = this.bd.TraerTodos('turnos');
      this.listadoObservable.subscribe(turnos => {
        let turnosFiltrados = [];
        turnosFiltrados = turnos.filter(x => x.UidEspecialista === this.usuario.uid);
        this.turnos = turnosFiltrados.filter(x => x.Fecha === this.registerForm.value.fechaForm);
      });
    }
  }


  FiltrosAdministrador() {
    switch (this.opcionFiltroAdm) {
      case 'Cancelados por especialidad':
        this.listadoObservable = this.bd.TraerTodos('turnos');
        this.listadoObservable.subscribe(turnos => {
            this.turnos = turnos.filter(x => x.Estado === EstadoTurno.Cancelado)
                  .sort((a, b) => a.Especialidad.localeCompare(b.Especialidad));
          });
        break;
      case 'Realizados por clientes':
          this.listadoObservable = this.bd.TraerTodos('turnos');
          this.listadoObservable.subscribe(turnos => {
              this.turnos = turnos.filter(x => x.CreadoPorCliente)
                    .sort((a, b) => a.NombreCliente.localeCompare(b.NombreCliente));
            });
          break;
      case 'Realizados por recepcionisas':
          this.listadoObservable = this.bd.TraerTodos('turnos');
          this.listadoObservable.subscribe(turnos => {
              this.turnos = turnos.filter(x => !x.CreadoPorCliente)
                    .sort((a, b) => a.NombreCliente.localeCompare(b.NombreCliente));
            });
          break;
    }
  }


  FiltroAdminEntreDosFechas() {
    const fechaDesde = this.registerForm.value.fechaForm;
    const fechaHasta = this.registerForm.value.fechaForm2;

    if (fechaDesde > fechaHasta) {
      Swal.fire(
        `La primer fecha ${fechaDesde} no puede ser mayor que la segunda ${fechaHasta}.`
      );
      return;
    }

    let turnosList;
    turnosList = this.turnos.filter(x => x.Fecha >= fechaDesde && x.Fecha <= fechaHasta).length;

    Swal.fire(
      `Hay ${turnosList} turnos registrados entre el ${fechaDesde} y ${fechaHasta}.`
    );
  }



  TraerClientes() {
    this.listadoObservable = this.bd.TraerTodos('users');
    this.listadoObservable.subscribe(x => {
      this.clientes = x.filter(user => user.type === 'Cliente');
    });
  }

  TraerEspecialistas() {
    this.listadoObservable = this.bd.TraerTodos('users');
    this.listadoObservable.subscribe(x => {
      this.especialistas = x.filter(user => user.type === 'Especialista');
    });
  }

  TraerEspecialistas2() {
    // console.log("form antes: " + this.especialistaForm.value);
    // console.log("especialistas antes: " + this.especialistas.length);
    this.especialistas = [];
    this.especialistaForm.setValue(null);
    // console.log("especialistas despues: " + this.especialistas.length);
    // console.log("form despues: " + this.especialistaForm.value);
    this.especialistaForm.reset();

    const fechaSelected = this.registerForm.value.fechaForm;

    let turnosIgualDia = [];
    turnosIgualDia = this.turnos.filter(turno =>
      turno.Fecha === fechaSelected && turno.Estado === EstadoTurno.Pendiente);

    console.log(turnosIgualDia);

    let especialistasAux = [];

    this.listadoObservable = this.bd.TraerTodos('users');
    this.listadoObservable.subscribe(usuarios => {
      especialistasAux = usuarios.filter(usuario => usuario.type === 'Especialista');
      especialistasAux.forEach(especialista => {
        if (turnosIgualDia.filter(turnoDia => turnoDia.UidEspecialista === especialista.Uid).length < 3) {
          this.especialistas.push(especialista);
        }
      });
    });
  }


  TraerTurnos() {
    this.listadoObservable = this.bd.TraerTodos('turnos');
    this.listadoObservable.subscribe(turnos => {
      console.log(this.turnos);
      if (this.usuario.type === 'Cliente') {
        this.turnos = turnos.filter(x => x.UidCliente === this.usuario.uid).sort((a, b) => b.Fecha - a.Fecha);
      } else if (this.usuario.type === 'Recepcionista') {
        this.turnos = turnos.sort((a, b) => b.Fecha - a.Fecha);
      } else if (this.usuario.type === 'Especialista') {
        this.turnos = turnos.filter(x => x.UidEspecialista === this.usuario.uid).sort((a, b) => b.Fecha - a.Fecha);
      } else if (this.usuario.type === 'Admin') {
        this.turnos =  turnos.sort((a, b) => a.Especialidad.localeCompare(b.Especialidad));
      }
    });
  }


  descarga() {
    // this.eliminOK = false;
    const documentDefinition = { content: [
        {
            text: 'Mis Turnos',
            bold: true,
            fontSize: 20,
            alignment: 'center',
            decoration: 'underline',
            margin: [0, 0, 0, 20]
        },
        this.getListaTurnosPDF(),
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
    pdfMake.createPdf(documentDefinition).download('ListadoTurnos.pdf');
  }

  getListaTurnosPDF() {
    const exs = [];
    this.turnos.forEach(element => {
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
              text:  'Fecha: ' + element.Fecha,
              style: 'name'
            },
            {
              text:  'Estado: ' + element.Estado,
              style: 'name'
            },
            {
              text:  'Consultorio: ' + element.Consultorio,
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

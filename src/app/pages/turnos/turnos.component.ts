import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/classes/user';
import { FirebaseBdService } from 'src/app/services/firebase-bd.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
import { TurnoInterface, EstadoTurno } from 'src/app/classes/turno';
import { Observable } from 'rxjs/internal/Observable';
import { EncuestaInterface } from 'src/app/classes/encuesta';



@Component({
  selector: 'app-turnos',
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {
  clienteForm = new FormControl('', Validators.required);
  especialistaForm = new FormControl('', Validators.required);
  fechaForm = new FormControl('', Validators.required);

  registerForm: FormGroup = this.formBuilder.group({
    fechaForm: this.fechaForm,
    especialistaForm: this.especialistaForm,
    clienteForm: this.clienteForm
  });


  usuario: User;
  listadoObservable: Observable<any[]>;
  especialistas: User[];  // ver disponibilidad especialistas funcion TraerEspecialistasPorFecha()
  clientes: User[];
  turnos: TurnoInterface[];


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
    this.TraerEspecialistas();
    this.TraerTurnos();

    if (this.usuario.type === 'Cliente' ) {
      // this.registerForm.value.clienteForm.setValue(this.usuario);
      this.registerForm.patchValue({clienteForm: this.usuario});
    }
  }


  CrearTurno() {
    this.bd.TraerTodos2('consultorios').then(consultorios => {
      console.log(consultorios);

      const consultorio = consultorios[Math.floor((Math.random() * 2))];
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

      // this.TraerEspecialistasPorFecha();
      // this.fechaForm.setValue("");
      // this.especialistaForm.setValue("");
      // if (this.perfil == Perfil.Cliente) {
      //   this.clienteForm.setValue(this.user);
      // }
      // else {
      //   this.clienteForm.setValue("");
      // }
      // this.especialistas = [];
    });
  }



  onReset() {
    // this.submitted = false;
    this.registerForm.reset();
  }


  cancelarTurno(turno: TurnoInterface) {
    Swal.fire({
      title: 'Cancelar Turno?',
      text: 'La accion no se puede revertir!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, deseo cancelarlo!'
    }).then((result) => {
      if (result.value) {
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
      confirmButtonText: 'Yes, marcar finalizado!'
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
          turno.Estado = EstadoTurno.Finalizado;
          turno.ObservacionesEspecialista = result.value;
          this.bd.ModificarUno(turno, 'turnos');
        });
      }
    });
  }

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result != undefined) {


        // this.dataApi.TraerUno(turno.ConsultorioId, 'consultorios').pipe(take(1)).subscribe(consultorio => {
        //   consultorio.Estado = EstadoConsultorio.Libre;
        //   this.dataApi.ModificarUno(consultorio, 'consultorios');
        // });
    //   }
    // });

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

  TraerTurnos() {
    this.listadoObservable = this.bd.TraerTodos('turnos');
    this.listadoObservable.subscribe(turnos => {
      console.log(this.turnos);
      if (this.usuario.type === 'Cliente') {
        this.turnos = turnos.filter(x => x.UidCliente === this.usuario.uid);
      } else if (this.usuario.type === 'Recepcionista') {
        this.turnos = turnos;
      } else if (this.usuario.type === 'Especialista') {
        this.turnos = turnos.filter(x => x.UidEspecialista === this.usuario.uid);
      }
    });
  }



}

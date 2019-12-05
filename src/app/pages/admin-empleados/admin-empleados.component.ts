import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/classes/user';
import { FirebaseBdService } from 'src/app/services/firebase-bd.service';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-admin-empleados',
  templateUrl: './admin-empleados.component.html',
  styleUrls: ['./admin-empleados.component.css']
})
export class AdminEmpleadosComponent implements OnInit {
  isLoading = false;
  listadoEmpleados: Array<User>;
  logs;

  cards = {
    especialistas: 0,
    total: 0,
    recepcionistas: 0,
  };

  listadoDeUsuarios: Observable<any[]>;


  constructor(public bd: FirebaseBdService ) { }

  ngOnInit() {
    // this.obtenerUsuarios();
    this.ObtenerUsuarios2();
  }



  public Borrar(empleado?: any) {
    // this.peliculaServ.BorrarUno(this.idPelicula)
    // .subscribe( () => {
    //   this.borrado.emit(this.idPelicula);
    // });
    console.log(empleado);
  }



  ObtenerUsuarios2() {
    this.listadoDeUsuarios = this.bd.TraerTodos('users');
    this.listadoDeUsuarios.subscribe(x => {
      this.listadoEmpleados = x.filter(user => user.type.toUpperCase() === 'Recepcionista'.toUpperCase() ||
      user.type.toUpperCase() === 'Especialista'.toUpperCase());
      this.obtenerCards(this.listadoEmpleados);
    });
  }



  obtenerUsuarios() {
    this.isLoading = true;
    this.bd.TraerTodos2('user')
      .then(result => {
        this.isLoading = false;
        console.log(result);
        this.listadoEmpleados = result.filter(user => user.type.toUpperCase() === 'Recepcionista'.toUpperCase() ||
           user.type.toUpperCase() === 'Especialista'.toUpperCase());
      });
  }

  obtenerLogs(usuario) {
    this.isLoading = true;
    this.bd.GetLogs(usuario)
      .then(result => {
        this.isLoading = false;
        console.log(result);
        this.logs = result.map(log => log.createdAt.toDate());
      });
  }

  obtenerCards(listado) {
    listado.forEach((usuario: User) => {
        this.cards.total++;
        if(usuario.type === 'Recepcionista') {
          this.cards.recepcionistas++;
        } else if(usuario.type === 'Especialista') {
          this.cards.especialistas++;
        }
    });
  }



}

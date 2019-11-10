import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/classes/user';
import { FirebaseBdService } from 'src/app/services/firebase-bd.service';

@Component({
  selector: 'app-admin-empleados',
  templateUrl: './admin-empleados.component.html',
  styleUrls: ['./admin-empleados.component.css']
})
export class AdminEmpleadosComponent implements OnInit {
  isLoading = false;
  listadoEmpleados: Array<User>;

  constructor(public bd: FirebaseBdService) { }

  ngOnInit() {
    this.obtenerUsuarios();
  }


  public Borrar(empleado?: any) {
    // this.peliculaServ.BorrarUno(this.idPelicula)
    // .subscribe( () => {
    //   this.borrado.emit(this.idPelicula);
    // });
    console.log(empleado);
  }





  obtenerUsuarios() {
    this.isLoading = true;
    this.bd.GetUsers()
      .then(result => {
        this.isLoading = false;
        console.log(result);
        this.listadoEmpleados = result.filter(user => user.type.toUpperCase() === 'Recepcionista'.toUpperCase() ||
           user.type.toUpperCase() === 'Especialista'.toUpperCase());;
      });
  }

}

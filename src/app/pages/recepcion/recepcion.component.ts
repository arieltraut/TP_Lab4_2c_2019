import { Component, OnInit } from '@angular/core';
import { FirebaseBdService } from 'src/app/services/firebase-bd.service';
import { Observable } from 'rxjs/internal/Observable';


@Component({
  selector: 'app-recepcion',
  templateUrl: './recepcion.component.html',
  styleUrls: ['./recepcion.component.css']
})
export class RecepcionComponent implements OnInit {

  isLoading = false;
  listadoObservable: Observable<any[]>;
  listadoConsultorios: Array<any>;


  constructor(private bd: FirebaseBdService) { }

  ngOnInit() {
    this.ObtenerConsultorios();

  }

  ObtenerConsultorios() {
    this.isLoading = true;
    this.listadoObservable = this.bd.TraerTodos('consultorios');
    this.listadoObservable.subscribe(x => {
      this.listadoConsultorios = x.sort((a, b) => b.Estado - a.Estado);
      this.isLoading = false;
    });
  }

}

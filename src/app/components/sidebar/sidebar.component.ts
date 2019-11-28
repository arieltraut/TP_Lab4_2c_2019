import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseBdService } from 'src/app/services/firebase-bd.service';
import { User } from 'src/app/classes/user';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  type: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/profile', title: 'Inicio',  icon: 'fas fa-home', class: '', type: 'all' },
  { path: '/especialidades', title: 'Especialidades',  icon: 'fas fa-first-aid', class: '', type: 'Admin' },
  { path: '/recepcion', title: 'Recepcion',  icon: 'fas fa-person-booth', class: '', type: 'Recepcionista' },
  { path: '/turnos', title: 'Turnos',  icon: 'far fa-calendar-check', class: '', type: 'all' },
  { path: '/empleados', title: 'Empleados',  icon: 'fas fa-user-alt', class: '', type: 'Admin' },
  { path: '/altas', title: 'Altas',  icon: 'fas fa-user-plus', class: '', type: 'Admin' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(
    public authService: FirebaseAuthService,
    public bdService: FirebaseBdService,
    public router: Router,
  ) { }

  public usuario: User;
  public menuItems: any[];



  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('user-bd'));
    // console.log('Este es el log:' + this.usuario.uid);
    this.menuItems = ROUTES.filter(menuItem => menuItem.type === this.usuario.type || menuItem.type === 'all' );
  }

}

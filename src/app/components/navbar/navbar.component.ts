import { Component, OnInit } from '@angular/core';
import { FirebaseBdService } from 'src/app/services/firebase-bd.service';
import { User } from 'src/app/classes/user';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  usuario: User;

  constructor( public authService: FirebaseAuthService,
               public bdService: FirebaseBdService) { }

  ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('user'));
    // console.log('Este es el log:' + this.usuario.uid);
    this.bdService.GetUser2('users', this.usuario)
    .then(result => {
      console.log(result);
      this.usuario = result;
    });
  }

}

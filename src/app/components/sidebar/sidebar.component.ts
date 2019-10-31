import { Component, OnInit, NgZone } from '@angular/core';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { Router } from '@angular/router';
import { FirebaseBdService } from 'src/app/services/firebase-bd.service';
import { User } from 'firebase';



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
    public ngZone: NgZone
  ) { }

  public usuario: User;


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

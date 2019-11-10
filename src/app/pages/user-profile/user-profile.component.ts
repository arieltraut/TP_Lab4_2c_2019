import { Component, OnInit, NgZone } from '@angular/core';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { Router } from '@angular/router';
import { FirebaseBdService } from 'src/app/services/firebase-bd.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  // isLoading: boolean = false;
  usuario: any;

  constructor(
    public authService: FirebaseAuthService,
    public bdService: FirebaseBdService,
    public router: Router,
    public ngZone: NgZone
  ) { }



  ngOnInit() {
      this.usuario = JSON.parse(localStorage.getItem('user'));
      console.log('Este es el log:' + this.usuario.uid);
      this.bdService.GetUser('users', this.usuario)
      .then(result => {
        console.log(result);
        this.usuario = result;
      });
  }



}

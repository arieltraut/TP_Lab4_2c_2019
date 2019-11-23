import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('alertError', { static: true }) alertError: ElementRef;
  isLoading = false;

  constructor( public authService: FirebaseAuthService,
               private router: Router) {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/profile']);
    }
   }

  ngOnInit() {
  }

  onLogin(userEmail, userPassword) {
    this.isLoading = true;
    this.authService.SignIn(userEmail, userPassword).then((result) => {
      this.isLoading = false;
    }).catch((error) => {
      this.isLoading = false;
      this.mostrarAlert();
      console.info(error);
    });
  }

  mostrarAlert() {
    this.alertError.nativeElement.classList.remove('d-none');
  }


  MockLogin(perfil: string) {

    switch (perfil) {
      case 'administrador':
        this.onLogin('arieltraut@gmail.com', 'arieltraut');
        break;
      case 'cliente':
        this.onLogin('fernando@gmail.com', 'fernando');
        break;
      case 'especialista':
        this.onLogin('tywin@gmail.com', 'password');
        break;
      case 'recepcionista':
        this.onLogin('jaimelannister@gmail.com', 'password');
        break;
      default:
        this.onLogin('arieltraut@gmail.com', 'arieltraut');
        break;
    }
  }

}

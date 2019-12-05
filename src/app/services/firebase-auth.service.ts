import { Injectable, NgZone } from '@angular/core';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from '../classes/user';
import { getAttrsForDirectiveMatching } from '@angular/compiler/src/render3/view/util';
import { FirebaseBdService } from './firebase-bd.service';
import {first} from 'rxjs/operators';
import { resolve } from 'url';

@Injectable({
  providedIn: 'root'
})

export class FirebaseAuthService {

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public bdService: FirebaseBdService,
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when
    logged in and setting up null when logged out */

    this.afAuth.authState.subscribe(user => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        JSON.parse(localStorage.getItem('user'));

        // guardando en localstorge de la coleccion user
        // this.bdService.GetUser('users', user)
        // .then(result => {
        //   console.log(result);
        //   localStorage.setItem('user-bd', JSON.stringify(result));
        //   JSON.parse(localStorage.getItem('user-bd'));
        // });
        this.guardarEnBd(user);

      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  // Sign in with email/password
  SignIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        // console.log('el result es: ' + result.user);

        // this.guardarEnBd(result.user);

        this.bdService.AddLog(result.user);

      }).catch((error) => {
        window.alert(error.message);
      });
  }

  // Sign up with email/password
  SignUp(email, password, name, esAdmin, photoURL?, type?, especialidad?): any {
    let admin;
    if (esAdmin) {
      admin = JSON.parse(localStorage.getItem('user-bd'));
    }

    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((result) => {

        this.SetUserData(result.user, name, photoURL, type, especialidad);
        if (!esAdmin) {
          // this.router.navigate(['/login']);
        }
        if (esAdmin) {
          this.SignIn(admin.email, 'arieltraut');
        }
      }).catch((error) => {
        window.alert(error.message);
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    const userBd = JSON.parse(localStorage.getItem('user-bd'));
    return (user !== null && userBd !== null) ? true : false;
  }


  /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user, name, photo?, type?, especial?) {
    const date = new Date();
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);  // cada coleccion le pone nombre del id de usuario
    const userData: User = {
      uid: user.uid,
      email: user.email,
      // name: user.email.split('@')[0],
      // createdAt: date.toLocaleDateString(),
      lastLoginAt: date.toLocaleDateString(),
      displayName: name,
      photoURL: photo,
      type: (type) ? type : 'Cliente',
      especialidad: (especial) ? especial : 'Ninguna'
      // emailVerified: user.emailVerified
    };
    return userRef.set(userData, {
      merge: true
    });
  }

  // Sign out
  SignOut() {
    return this.afAuth.auth.signOut().then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('user-bd');
      this.router.navigate(['login']);
    });
  }



  guardarEnBd(user) {
          // guardando en localstorge de la coleccion user
    this.bdService.TraerUno(user.uid, 'users')
          .then(result => {
            console.log(result);
            localStorage.setItem('user-bd', JSON.stringify(result));
            JSON.parse(localStorage.getItem('user-bd'));
            this.router.navigate(['profile']);
          });
  }


}

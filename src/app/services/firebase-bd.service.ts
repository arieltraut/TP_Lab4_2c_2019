import { Injectable } from '@angular/core';
import { AngularFirestore, } from '@angular/fire/firestore';
import firebase from '@firebase/app';
import 'firebase/firestore';



@Injectable({
  providedIn: 'root'
})
export class FirebaseBdService {

  constructor(private afs: AngularFirestore ) { }


  GetUsers() {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('/users').valueChanges().subscribe(snapshots => {
        resolve(snapshots);
      });
    });
  }

  // GetUser(collection, usuario) { (Mariano)
  //   return new Promise<any>((resolve, reject) => {
  //     this.afs.collection(`${collection}/${usuario.uid}`).valueChanges().subscribe(snapshots => {
  //       resolve(snapshots);
  //     });
  //   });
  // }

  GetUser(collection, usuario) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(`${collection}`).doc(`${usuario.uid}`).valueChanges().subscribe(snapshots => {
        resolve(snapshots);
      });
    });
  }

  AddLog(usuario) { // ver tema timestamp
    const date = new Date();
    this.afs.collection('users').doc(usuario.uid).update({
      lastLoginAt: date.toLocaleDateString()
    });
    this.afs.collection('users').doc(usuario.uid).collection('logs').doc(date.valueOf().toString()).set({
      createdAt: date
    });
  }

  GetLogs(usuario) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('/users').doc(`${usuario.uid}`).collection('/logs').valueChanges().subscribe(snapshots => {
        resolve(snapshots);
      });
    });
  }


  GetEspecialidades() {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('/especialidades').valueChanges().subscribe(snapshots => {
        resolve(snapshots);
      });
    });
  }


}


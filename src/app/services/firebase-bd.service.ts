import { Injectable } from '@angular/core';
import { AngularFirestore, } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseBdService {

  constructor(private afs: AngularFirestore) { }


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


}


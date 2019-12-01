import { Injectable } from '@angular/core';
import { AngularFirestore, } from '@angular/fire/firestore';
import firebase from '@firebase/app';
import 'firebase/firestore';



@Injectable({
  providedIn: 'root'
})
export class FirebaseBdService {

  constructor(private afs: AngularFirestore,
              private firestore: AngularFirestore ) { }




  TraerTodos(collection) {
    return this.afs.collection<any>(collection).valueChanges();
  }

  // GetUser(collection, usuario) { (Mariano)
  //   return new Promise<any>((resolve, reject) => {
  //     this.afs.collection(`${collection}/${usuario.uid}`).valueChanges().subscribe(snapshots => {
  //       resolve(snapshots);
  //     });
  //   });
  // }


  TraerTodos2(collection) {  // no trae a tiempo, reemplazada por traertodos
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(collection).valueChanges().subscribe(snapshots => {
        resolve(snapshots);
      });
    });
  }

  TraerUno(id, collection) {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection(`${collection}`).doc(id).valueChanges().subscribe(snapshots => {
        resolve(snapshots);
      });
    });
  }

  AgregarUno(objeto: any, collection: string): void {
    const id = this.firestore.createId();
    objeto.id = id;
    this.afs.collection(collection).doc(id).set(objeto);

    // this.afs.collection(collection).add(objeto);
    // .doc().set(objeto);
  }

  ModificarUno(objeto: any, collection: string): void {
    const id = objeto.id;
    const objetoDoc = this.afs.doc<any>(`${collection}/${id}`);
    objetoDoc.update(objeto);
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


}


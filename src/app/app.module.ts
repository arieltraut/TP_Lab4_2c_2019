import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FileSelectDirective } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';


const firebaseConfig = {
  apiKey: 'AIzaSyBw42z98N348sCwWVey9uESC2whYKhGDEQ',
  authDomain: 'tp-2-lab4.firebaseapp.com',
  databaseURL: 'https://tp-2-lab4.firebaseio.com',
  projectId: 'tp-2-lab4',
  storageBucket: 'tp-2-lab4.appspot.com',
  messagingSenderId: '856811049330',
  appId: '1:856811049330:web:2ad33d953fda11b2478deb',
  measurementId: 'G-Z0X6QL7JNF'
};


// Mine
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FirebaseAuthService } from './services/firebase-auth.service';
import { RegisterComponent } from './components/register/register.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { FirebaseBdService } from './services/firebase-bd.service';
import { AdminAltasComponent } from './pages/admin-altas/admin-altas.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    RegisterComponent,
    NavbarComponent,
    UserProfileComponent,
    SidebarComponent,
    FooterComponent,
    AdminAltasComponent,
    FileUploaderComponent,
    FileSelectDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(firebaseConfig),
    BrowserAnimationsModule,
    AngularFontAwesomeModule
  ],
  providers: [FirebaseAuthService,
              FirebaseBdService,
              AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }

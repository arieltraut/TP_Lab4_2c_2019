import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
// para poder hacer las validaciones
// import { Validators, FormBuilder, FormControl, FormGroup} from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @ViewChild('alertOk', { static: true }) alertOk: ElementRef;
  @ViewChild('alertError', { static: true }) alertError: ElementRef;

  isLoading = false;
  registerForm: FormGroup;
  submitted = false;
  captchaVerificado: boolean;

  filename = 'Subir imagen de perfil';
  imagePath: any;
  message: string;

  selectedFile: File = null;
  downloadURL: string;

  constructor( private authenticationService: FirebaseAuthService,
               private storage: AngularFireStorage,
               private formBuilder: FormBuilder,
               private router: Router) {
                if (this.authenticationService.isLoggedIn) {
                  this.router.navigate(['/profile']);
                }
               }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
      photo: ['', Validators.required]
    }, {
        validator: MustMatch('password', 'confirmPassword')
    });
    this.captchaVerificado = false;
  }


  // para acceder facilmente a los controles del form
  get f() { return this.registerForm.controls; }



  onRegistrar() {
    this.authenticationService.SignUp(this.registerForm.value.email,
                                      this.registerForm.value.password,
                                      this.registerForm.value.name,
                                      false,
                                      this.downloadURL)
      .then((result) => {
        this.isLoading = false;
        this.onReset();
        this.mostrarAlert(true);
      }).catch((error) => {
        this.isLoading = false;
        this.onReset();
        this.mostrarAlert(false);
        console.info(error);
      });
  }

  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }

  mostrarAlert(bool: boolean) {
    if (bool) {
      this.alertOk.nativeElement.classList.remove('d-none');
    } else {
      this.alertError.nativeElement.classList.remove('d-none');
    }
  }

  resolved(captchaResponse: string) {
    this.captchaVerificado = true;
  }


  /***********file upload***********/
  getFileName(files) {
    // console.log(files[0]);
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Solo se pueden seleccionar imagenes.';
      return;
    }
    this.filename = files[0].name;
    this.selectedFile = files[0]; // guarda archivo para subirlo en startUpload()
  }


  startUpload() { // (event: FileList)
    this.submitted = true;

    // si el form es invalido nada
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;

    // The File object
    const file = this.selectedFile; // event.item(0);

    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type :( ');
      return;
    }

    // The storage ref
    const storageRef = this.storage.ref('images/' + file.name);

    // Upload the file and metadata
    const uploadTask = storageRef.put(file);

    uploadTask.task.on('state_changed', (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');

    }, (error) => {
      // Handle unsuccessful uploads

    }, () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
       uploadTask.task.snapshot.ref.getDownloadURL().then((downloadURL) => {
        console.log('File available at', downloadURL);
        this.downloadURL = downloadURL;
        // this.db.collection('photos').add( { downloadURL });

        this.onRegistrar();

      });
    });
  }









}

// custom validator to check that two fields match
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

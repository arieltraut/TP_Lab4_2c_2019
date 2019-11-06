import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-admin-altas',
  templateUrl: './admin-altas.component.html',
  styleUrls: ['./admin-altas.component.css']
})
export class AdminAltasComponent implements OnInit {

  @ViewChild('alertOk', { static: true }) alertOk: ElementRef;
  @ViewChild('alertError', { static: true }) alertError: ElementRef;

  isLoading = false;
  registerForm: FormGroup;
  submitted = false;

  especialidades: string[] = ['Cariologia', 'Ortodoncia', 'Implantologia', 'Radiologia'];

  filename = 'Elegir archivo';
  imagePath: any;
  imgURL: any;
  message: string;

  selectedFile: File = null;
  downloadURL: string;

  constructor( private authenticationService: FirebaseAuthService,
               private storage: AngularFireStorage,
               private formBuilder: FormBuilder,
               private router: Router) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      type: ['', Validators.required],
      especialidad: ['', Validators.required]
    }, {
        validator: MustMatch('password', 'confirmPassword')
      });
  }

  // para acceder facilmente a los controles del form
  get f() { return this.registerForm.controls; }

  onRegistrar() {

    // this.submitted = true;

    // si es invalido nada
    /* if (this.registerForm.invalid) {
      return;
    }*/

    // this.isLoading = true;


    // form valido


    // tslint:disable-next-line: max-line-length
    this.authenticationService.SignUp(this.registerForm.value.email,
                                      this.registerForm.value.password,
                                      this.registerForm.value.name,
                                      true,
                                      this.downloadURL,
                                      this.registerForm.value.type,
                                      this.registerForm.value.especialidad)
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

  getFileName(fileInput: Event) {
    // tslint:disable-next-line: max-line-length
    const file = (fileInput.target as HTMLInputElement).files[0];  // as = casting, tambien asi: (<HTMLInputElement>fileInput.target).files[0]
    this.filename = file.name;
  }

  preview(files) {
    if (files.length === 0) {
      return;
    }

    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Solo se pueden seleccionar imagenes.';
      return;
    }

    this.selectedFile = files[0]; // guarda archivo para subirlo en startUpload()

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.imgURL = reader.result;
    };
  }


  startUpload() { // (event: FileList)

    this.submitted = true;

    if (this.registerForm.value.type != 'Especialista') {
      this.registerForm.controls['especialidad'].setValue('Ninguna'); }

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

    // Create file metadata including the content type
    const metadata = {
      contentType: 'image/jpeg',
    };

    // Upload the file and metadata
    const uploadTask = storageRef.put(file, metadata);

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



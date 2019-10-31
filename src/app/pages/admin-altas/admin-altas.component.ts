import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { Router } from '@angular/router';

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

  constructor( private authenticationService: FirebaseAuthService,
               private formBuilder: FormBuilder,
               private router: Router) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      type: [''],
      especialidad: ['']
    }, {
        validator: MustMatch('password', 'confirmPassword')
      });
  }

  // para acceder facilmente a los controles del form
  get f() { return this.registerForm.controls; }

  onRegistrar() {
    this.submitted = true;

    // si es invalido nada
    if (this.registerForm.invalid) {
      return;
    }
    this.isLoading = true;
    // form valido
    // tslint:disable-next-line: max-line-length
    this.authenticationService.SignUp(this.registerForm.value.email,
                                      this.registerForm.value.password,
                                      this.registerForm.value.name,
                                      'photourl',
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

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (event) => {
      this.imgURL = reader.result;
    };
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

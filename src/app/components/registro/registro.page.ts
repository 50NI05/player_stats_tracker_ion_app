import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { loadingSpinner } from '../../shared/loading/loading.component';
import { AuthService } from '../../services/auth.service';
import { alertModal } from 'src/app/shared/alert/alert.component';
import { Constant } from 'src/app/shared/constant/constant.component';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  namePattern = /^[a-zA-ZñÑáÁéÉíÍóÓúÚ ]+$/;
  passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\-]).{6,20}$/;
  // emailPattern = /^(([a-zA-Z0-9]([\.\-\_]){1})|([a-zA-Z0-9]))+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4}|[a-zA-Z]{1,3}\.[a-zA-Z]{1,3})$/;
  emailPattern = /^(?=.*[a-zA-Z0-9@.])[a-zA-Z0-9@.]{6,15}$/

  formularioRegistro: FormGroup;
  passwordVisibility: boolean = true;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    private auth: AuthService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController
  ) {
    this.formularioRegistro = this.fb.group({
      firstname: new FormControl("", [Validators.required, Validators.pattern(Constant.Pattern.Form.Name)]),
      lastname: new FormControl("", [Validators.required, Validators.pattern(Constant.Pattern.Form.Name)]),
      email: new FormControl("", [Validators.required, Validators.pattern(this.emailPattern)]),
      password: new FormControl("", [Validators.required, Validators.pattern(this.passwordPattern)]),
      // confirmacionPassword: new FormControl("", Validators.required)
    });
  }

  ngOnInit() { }

  validateName(event: KeyboardEvent) {
    let regex = RegExp(this.namePattern);
    return regex.test(event.key);
  }

  checkFirstName() {
    if (this.formularioRegistro.controls['firstname'].value[0] === ' ') {
      this.formularioRegistro.controls['firstname'].reset();
    }
  }

  checkLastName() {
    if (this.formularioRegistro.controls['lastname'].value[0] === ' ') {
      this.formularioRegistro.controls['lastname'].reset();
    }
  }

  validateEmail(event: KeyboardEvent) {
    return !(event.key === ' ');
  }

  checkEmail() {
    if (this.formularioRegistro.controls['email'].value[0] === ' ') {
      this.formularioRegistro.controls['email'].reset();
    }
  }

  validatePassword(event: KeyboardEvent) {
    return !(event.key === ' ');
  }

  checkPassword() {
    if (this.formularioRegistro.controls['password'].value[0] === ' ') {
      this.formularioRegistro.controls['password'].reset();
    }
  }

  showPassword() {
    if (this.passwordVisibility === true) {
      this.passwordVisibility = false;
    } else {
      this.passwordVisibility = true;
    }
  }

  // async guardar() {

  //   var f = this.formularioRegistro.value;

  //   if (this.formularioRegistro.invalid) {
  //     const alert = await this.alertController.create({
  //       header: 'Datos incompletos',
  //       message: 'Tienes que llenar todos los datos',
  //       buttons: ['Aceptar']
  //     });

  //     await alert.present();
  //     return;
  //   }

  //   var usuario = {
  //     nombre: f.nombre,
  //     password: f.password
  //   }

  //   localStorage.setItem('usuario', JSON.stringify(usuario));

  //   localStorage.setItem('ingresado', 'true');
  //   this.navCtrl.navigateRoot('inicio');
  // }

  async register(registerForm: any) {
    await loadingSpinner(this.loadingCtrl);

    let data = {
      firstname: registerForm.firstname.trim(),
      lastname: registerForm.lastname.trim(),
      email: registerForm.email,
      password: registerForm.password,
      id_profile: 2
    }
    console.log(data);
    this.loadingCtrl.dismiss();

    this.auth.call(data, 'register', 'POST', false).subscribe({
      next: (response) => {
        if (response.status === Constant.SUCCESS) {
          console.log(response);
          this.loadingCtrl.dismiss();
          alertModal({
            title: response.status,
            text: 'Usuario registrado exitosamente. ¿Deseas iniciar sesión?',
            button: [
              {
                text: 'Cerrar',
                role: 'cancel',
                cssClass: 'alert-button-cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Aceptar',
                cssClass: 'alert-button-confirm',
                handler: () => {
                  this.navCtrl.navigateRoot('login');
                }
              }
            ],
            alertController: this.alertController
          })

        } else {
          console.log(response);
          this.loadingCtrl.dismiss();

          alertModal({
            title: response.status,
            text: response.data,
            button: [
              {
                cssClass: 'alert-button-cancel',
                text: 'Cerrar',
              }
            ],
            alertController: this.alertController
          })
        }
      },
      error: (error) => {
        console.log(error);
        this.loadingCtrl.dismiss();

        alertModal({
          title: 'Error',
          text: 'Falla en el servidor',
          button: [
            {
              cssClass: 'alert-button-cancel',
              text: 'Cerrar',
            }
          ],
          alertController: this.alertController
        })
      }
    })
  }

}

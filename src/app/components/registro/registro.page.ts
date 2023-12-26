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
  emailPattern = /^(([a-zA-Z0-9]([\.\-\_]){1})|([a-zA-Z0-9]))+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4}|[a-zA-Z]{1,3}\.[a-zA-Z]{2,3})$/

  form: FormGroup;
  passwordVisibility: boolean = true;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    private auth: AuthService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController
  ) {
    this.form = this.fb.group({
      firstname: new FormControl("", [Validators.required, Validators.pattern(Constant.Pattern.Form.Name), this.validateMaxDigits(30)]),
      lastname: new FormControl("", [Validators.required, Validators.pattern(Constant.Pattern.Form.Name), this.validateMaxDigits(30)]),
      username: new FormControl("", [Validators.required, Validators.pattern(Constant.Pattern.Form.Username), this.validateMaxDigits(15)]),
      email: new FormControl("", [Validators.required, Validators.pattern(this.emailPattern), this.validateMaxDigits(50)]),
      password: new FormControl("", [Validators.required, Validators.pattern(this.passwordPattern), this.validateMaxDigits(20)]),
      // confirmacionPassword: new FormControl("", Validators.required)
    });
  }

  ngOnInit() { }

  validateName(event: KeyboardEvent) {
    let regex = RegExp(this.namePattern);
    return regex.test(event.key);
  }

  checkFirstName() {
    if (this.form.controls['firstname'].value[0] === ' ') {
      this.form.controls['firstname'].reset();
    }
  }

  checkLastName() {
    if (this.form.controls['lastname'].value[0] === ' ') {
      this.form.controls['lastname'].reset();
    }
  }

  validateEmail(event: KeyboardEvent) {
    return !(event.key === ' ');
  }

  checkEmail() {
    if (this.form.controls['email'].value[0] === ' ') {
      this.form.controls['email'].reset();
    }
  }

  validatePassword(event: KeyboardEvent) {
    return !(event.key === ' ');
  }

  checkPassword() {
    if (this.form.controls['password'].value[0] === ' ') {
      this.form.controls['password'].reset();
    }
  }

  showPassword() {
    if (this.passwordVisibility === true) {
      this.passwordVisibility = false;
    } else {
      this.passwordVisibility = true;
    }
  }

  validateMaxDigits(maxDigits: number) {
    return (control: { value: any; }) => {
      const value = control.value;
      if (value && value.toString().length > maxDigits) {
        return { maxDigitsExceeded: true };
      }
      return null;
    };
  }

  // async guardar() {

  //   var f = this.form.value;

  //   if (this.form.invalid) {
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
      username: registerForm.username.trim(),
      email: registerForm.email.trim(),
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
            title: 'Registro Exitoso',
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
          text: '¡Error en el Registro! Por favor, inténtalo de nuevo.',
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

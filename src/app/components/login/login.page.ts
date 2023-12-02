import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { loadingSpinner } from '../../shared/loading/loading.component';
import { AuthService } from '../../services/auth.service';
import { alertModal } from 'src/app/shared/alert/alert.component';
import { Constant } from 'src/app/shared/constant/constant.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // emailPattern = /^(([a-zA-Z0-9]([\.\-\_]){1})|([a-zA-Z0-9]))+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4}|[a-zA-Z]{1,3}\.[a-zA-Z]{1,3})$/;
  emailPattern = /^(?=.*[a-zA-Z0-9@.])[a-zA-Z0-9@.]{6,}$/;
  passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\-]).{6,20}$/;

  formularioLogin: FormGroup;
  passwordVisibility: boolean = true;
  logged: boolean = false;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    private authService: AuthService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController
  ) {

    this.formularioLogin = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      password: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)])
    })

  }

  ngOnInit() {
    if (this.authService.getLogged() === false) {
      this.authService.setLogged(false)
      this.authService.setModelLog(this.authService.modelLog);
    } else if (this.authService.getLogged() === true || this.authService.getLogged() === null) {
      this.authService.setLogged(true)
      this.authService.setModelLog(this.authService.modelLog);
    }

    console.log(this.authService.getLogged());
  }

  validateEmail(event: KeyboardEvent) {
    return !(event.key === ' ');
  }

  checkEmail() {
    if (this.formularioLogin.controls['email'].value[0] === ' ') {
      this.formularioLogin.controls['email'].reset();
    }
  }

  validatePassword(event: KeyboardEvent) {
    return !(event.key === ' ');
  }

  checkPassword() {
    if (this.formularioLogin.controls['password'].value[0] === ' ') {
      this.formularioLogin.controls['password'].reset();
    }
  }

  showPassword() {
    if (this.passwordVisibility === true) {
      this.passwordVisibility = false;
    } else {
      this.passwordVisibility = true;
    }
  }

  async login(loginForm: any) {
    await loadingSpinner(this.loadingCtrl)

    let data = {
      email: loginForm.email,
      password: loginForm.password
    }

    this.authService.call(data, 'login', 'POST', false).subscribe({
      next: async (response) => {
        if (response.status === Constant.SUCCESS) {
          console.log(response);
          this.authService.setToken(response.data.token);
          this.authService.setIdUser(response.data.id);
          this.authService.setProfile(response.data.profile.id);
          // this.authService.setEmail(response.email);
          this.authService.setModelSesionInSession(this.authService.modelSession);
          console.log(this.authService.getLogged());


          if (this.authService.getLogged() === true) {
            this.navCtrl.navigateRoot('onboarding');
          } else {
            this.navCtrl.navigateRoot('home');
          }

          this.loadingCtrl.dismiss();
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

  test() {
    alertModal({
      title: 'TEST',
      text: 'TEST',
      button: [
        {
          text: 'Cancelar',
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
            console.log('Buy clicked');
          }
        }
      ],
      alertController: this.alertController
    })
  }
}

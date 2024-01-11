import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { loadingSpinner } from '../../shared/loading/loading.component';
import { AuthService } from '../../services/auth.service';
import { alertModal } from 'src/app/shared/alert/alert.component';
import { Constant } from 'src/app/shared/constant/constant.component';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

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
  logged: any;
  band = false;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    private authService: AuthService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    private screenOrientation: ScreenOrientation
  ) {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)

    this.formularioLogin = this.fb.group({
      username: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      password: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)])
    })

  }

  ngOnInit() {
  }

  validateEmail(event: KeyboardEvent) {
    return !(event.key === ' ');
  }

  checkEmail() {
    if (this.formularioLogin.controls['username'].value[0] === ' ') {
      this.formularioLogin.controls['username'].reset();
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

  nextStep() {
    this.band = true
  }

  async login(loginForm: any) {
    await loadingSpinner(this.loadingCtrl)

    let data = {
      username: loginForm.username,
      password: loginForm.password
    }

    this.logged = this.authService.getLogged()

    this.authService.call(data, 'login', 'POST', false).subscribe({
      next: async (response) => {
        if (response.status === Constant.SUCCESS) {
          console.log(response);
          this.authService.setToken(response.data.token);
          this.authService.setIdUser(response.data.id);
          this.authService.setProfile(response.data.profile.id);
          this.authService.setModelSesionInSession(this.authService.modelSession);
          console.log('logged: ', this.logged);


          if (this.logged) {
            this.navCtrl.navigateRoot('home');
          } else {
            this.navCtrl.navigateRoot('onboarding');
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

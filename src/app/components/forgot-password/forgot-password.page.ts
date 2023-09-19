import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { alertModal } from 'src/app/shared/alert/alert.component';
import { Constant } from 'src/app/shared/constant/constant.component';
import { loadingSpinner } from 'src/app/shared/loading/loading.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  emailPattern = /^(?=.*[a-zA-Z0-9@.])[a-zA-Z0-9@.]{6,}$/;
  passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\-]).{6,20}$/;

  forgotPasswordForm: FormGroup;
  passwordVisibility: boolean = true;
  logged: boolean = false;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    private authService: AuthService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern), Validators.minLength(6)]),
      password: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern), Validators.minLength(6)])
    })
  }

  ngOnInit() {

  }

  validateEmail(event: KeyboardEvent) {
    return !(event.key === ' ');
  }

  checkEmail() {
    if (this.forgotPasswordForm.controls['email'].value[0] === ' ') {
      this.forgotPasswordForm.controls['email'].reset();
    }
  }

  validatePassword(event: KeyboardEvent) {
    return !(event.key === ' ');
  }

  checkPassword() {
    if (this.forgotPasswordForm.controls['password'].value[0] === ' ') {
      this.forgotPasswordForm.controls['password'].reset();
    }
  }

  showPassword() {
    if (this.passwordVisibility === true) {
      this.passwordVisibility = false;
    } else {
      this.passwordVisibility = true;
    }
  }

  async forgotPassword(form: any) {
    await loadingSpinner(this.loadingCtrl)

    this.authService.call(form, 'forgotPassword', 'POST', false).subscribe({
      next: async (response) => {
        if (response.status === Constant.SUCCESS) {
          alertModal({
            title: response.status,
            text: response.data,
            button: [
              {
                cssClass: 'alert-button-cancel',
                text: 'Cerrar',
                handler: () => {
                  this.navCtrl.navigateRoot('login');
                }
              }
            ],
            alertController: this.alertController
          })

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
}

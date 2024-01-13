import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, NavController, NavParams } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { alertModal } from '../../shared/alert/alert.component';
import { loadingSpinner } from '../../shared/loading/loading.component';
import { Constant } from 'src/app/shared/constant/constant.component';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.page.html',
  styleUrls: ['./user-information.page.scss'],
})
export class UserInformationPage implements OnInit {

  namePattern = /^[a-zA-ZñÑáÁéÉíÍóÓúÚ ]+$/;
  emailPattern = /^(?=.*[a-zA-Z0-9@.])[a-zA-Z0-9@.]{6,}$/;
  passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\-]).{6,20}$/;

  updateUserForm: FormGroup;
  profiles: any = [];

  constructor(
    private authService: AuthService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public form: FormBuilder,
    public alertController: AlertController,
    private modalCtrl: ModalController,
    private navParams: NavParams,
  ) {
    this.updateUserForm = this.form.group({
      firstname: new FormControl('', [Validators.required, Validators.pattern(this.namePattern)]),
      lastname: new FormControl('', [Validators.required, Validators.pattern(this.namePattern)]),
      email: new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]),
      username: new FormControl('', [Validators.required, Validators.pattern(Constant.Pattern.Form.Username)]),
      // password: new FormControl('', [Validators.pattern(this.passwordPattern)]),
      idProfile: new FormControl(''),
    })
  }

  ngOnInit() {
    this.getProfile()
    this.setUserInformation()
  }

  setUserInformation() {
    this.updateUserForm.controls['firstname'].setValue(this.navParams.get('user')[0].firstname)
    this.updateUserForm.controls['lastname'].setValue(this.navParams.get('user')[0].lastname)
    this.updateUserForm.controls['username'].setValue(this.navParams.get('user')[0].username)
    this.updateUserForm.controls['email'].setValue(this.navParams.get('user')[0].email)
    this.updateUserForm.controls['idProfile'].setValue(this.navParams.get('user')[0].profile.id)
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }

  validateName(event: KeyboardEvent) {
    let regex = RegExp(this.namePattern);
    return regex.test(event.key);
  }

  checkFirstName() {
    if (this.updateUserForm.controls['firstname'].value[0] === ' ') {
      this.updateUserForm.controls['firstname'].reset();
    }
  }

  checkLastName() {
    if (this.updateUserForm.controls['lastname'].value[0] === ' ') {
      this.updateUserForm.controls['lastname'].reset();
    }
  }

  validateEmail(event: KeyboardEvent) {
    return !(event.key === ' ');
  }

  checkEmail() {
    if (this.updateUserForm.controls['email'].value[0] === ' ') {
      this.updateUserForm.controls['email'].reset();
    }
  }

  validatePassword(event: KeyboardEvent) {
    return !(event.key === ' ');
  }

  checkPassword() {
    if (this.updateUserForm.controls['password'].value[0] === ' ') {
      this.updateUserForm.controls['password'].reset();
    }
  }

  async getProfile() {
    await loadingSpinner(this.loadingCtrl)

    this.authService.call(null, 'getProfile', 'GET', true).subscribe({
      next: (response) => {
        if (response.status === Constant.SUCCESS) {
          this.profiles = response.data
          this.loadingCtrl.dismiss()
        } else {
          console.log(response)
          this.loadingCtrl.dismiss()

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
        console.log(error)
        this.loadingCtrl.dismiss()

        alertModal({
          title: 'Error en la Plataforma',
          text: 'Lo sentimos, ha ocurrido un error en la plataforma. Por favor, intenta nuevamente más tarde.',
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

  alert(form: any) {
    alertModal({
      title: 'Actualización de Información',
      text: '¿Deseas actualizar la información del usuario seleccionado?',
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
            this.updateUser(form)
          }
        }
      ],
      alertController: this.alertController
    })
  }

  async updateUser(updateInformation: any) {
    await loadingSpinner(this.loadingCtrl)

    let data = {
      firstname: updateInformation.firstname.trim(),
      lastname: updateInformation.lastname.trim(),
      username: updateInformation.username.trim(),
      email: updateInformation.email.trim(),
      // password: updateInformation.password != '' ? updateInformation.password : this.navParams.get('user')[0].password,
      id_profile: updateInformation.idProfile
    }

    this.authService.call(data, `updateUser/${this.navParams.get('user')[0].id}`, 'PATCH', true).subscribe({
      next: (response) => {
        if (response.status === Constant.SUCCESS) {
          this.loadingCtrl.dismiss()

          alertModal({
            title: 'Succes',
            text: 'Usuario actualizado exitosamente',
            button: [
              {
                cssClass: 'alert-button-confirm',
                text: 'Aceptar',
                handler: () => {
                  this.confirm()
                }
              }
            ],
            alertController: this.alertController
          })
        } else {
          this.loadingCtrl.dismiss()
          alertModal({
            title: 'Error',
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
        console.log(error)
        this.loadingCtrl.dismiss()

        alertModal({
          title: 'Error en la Plataforma',
          text: 'Lo sentimos, ha ocurrido un error en la plataforma. Por favor, intenta nuevamente más tarde.',
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

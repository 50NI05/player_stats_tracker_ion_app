import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonModal, LoadingController, ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { loadingSpinner } from 'src/app/shared/loading/loading.component';
import { alertModal } from 'src/app/shared/alert/alert.component';
import { UserInformationPage } from '../user-information/user-information.page';
import { Constant } from 'src/app/shared/constant/constant.component';

interface Users {
  id: number,
  firstname: string,
  lastname: string,
  username: string,
  email: string,
  password: string,
  profile: {
    id: number,
    description: string
  }
}

interface User {
  id: number,
  firstname: string,
  lastname: string,
  username: string,
  email: string,
  password: string,
  profile: {
    id: number,
    description: string
  }
}

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  users: Users[] = [];
  user: User[] = [];
  form: FormGroup;
  label = {
    username: 'Usuario',
    profile: 'Perfil'
  }

  constructor(
    private authService: AuthService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public fb: FormBuilder,
    public alertController: AlertController,
    private modalCtrl: ModalController,
  ) {
    this.form = this.fb.group({
      filter: new FormControl(''),
    })
  }

  ngOnInit() {
    this.getUsers()
  }

  async openModal(idUser: any) {
    await this.getUser(idUser)
    console.log('users', this.user);

    const modal = await this.modalCtrl.create({
      component: UserInformationPage,
      componentProps: {
        user: this.user
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role) {
      this.getUsers()
    }
  }

  applyFilter() {
    const searchTerm = this.form.get('filter')?.value.toLowerCase();

    this.users = this.users.filter((user: Users) => {
      return (
        user.username.toLowerCase().includes(searchTerm) ||
        user.firstname.toLowerCase().includes(searchTerm) ||
        user.lastname.toLowerCase().includes(searchTerm)
      );
    });
  }

  refreshList() {
    this.form.get('filter')?.setValue('');
    this.getUsers()
  }

  async getUsers() {
    await loadingSpinner(this.loadingCtrl)

    this.authService.call(null, 'getUsers', 'GET', false).subscribe({
      next: (response) => {
        this.users = []
        if (response.status === Constant.SUCCESS) {
          response.data.map((e: {
            profile: any; id: any; firstname: any; lastname: any; username: any, email: any; password: any
          }) => {
            this.users.push({
              id: e.id,
              firstname: e.firstname,
              lastname: e.lastname,
              username: e.username,
              email: e.email,
              password: e.password,
              profile: {
                id: e.profile.id,
                description: e.profile.description
              }
            })
          })
          this.authService.setUsersList(this.users)
          this.authService.setModelUsers(this.authService.modelUsers)
          this.users.sort((a, b) => (a.firstname < b.firstname) ? -1 : 1)
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

  async getUser(id: any) {
    await loadingSpinner(this.loadingCtrl)
    return new Promise<void>((resolve, reject) => {
      this.authService.call(null, `getUser/${id}`, 'GET', false).subscribe({
        next: (response) => {
          if (response.status === Constant.SUCCESS) {
            this.user = []
            response.data.map((e: {
              id: number;
              profile: any; firstname: string; lastname: string; username: string; email: string; password: string;
            }) => {
              this.user.push({
                id: e.id,
                firstname: e.firstname,
                lastname: e.lastname,
                username: e.username,
                email: e.email,
                password: e.password,
                profile: {
                  id: e.profile.id,
                  description: e.profile.description
                }
              })
            })
          }

          console.log(this.user);

          resolve();
          this.loadingCtrl.dismiss()
        },
        error: (error) => {
          console.log(error)
          this.loadingCtrl.dismiss()

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
        },
      })
    })
  }

  async deleteUser(id: any) {
    await loadingSpinner(this.loadingCtrl)

    this.authService.call(null, `deleteUser/${id}`, 'DELETE', true).subscribe({
      next: (response) => {
        // this.users.pop()
        this.loadingCtrl.dismiss();
        if (response.status === Constant.SUCCESS) {
          alertModal({
            title: response.status,
            text: 'Usuario eliminado exitosamente',
            button: [
              {
                cssClass: 'alert-button-confirm',
                text: 'Aceptar',
              }
            ],
            alertController: this.alertController
          })

          this.getUsers()
        } else {
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
        console.log(error)
        this.loadingCtrl.dismiss()

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

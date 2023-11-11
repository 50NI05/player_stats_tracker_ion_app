import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { loadingSpinner } from 'src/app/shared/loading/loading.component';
import { alertModal } from 'src/app/shared/alert/alert.component';
import { Constant } from 'src/app/shared/constant/constant.component';
import { TeamDetailsPage } from '../team-details/team-details.page';

@Component({
  selector: 'app-add-team',
  templateUrl: './add-team.page.html',
  styleUrls: ['./add-team.page.scss'],
})
export class AddTeamPage implements OnInit {


  // ngOnInit(): void {
  // }

  // addEquipoForm: FormGroup;
  // equipos: any[] = [];

  // constructor(private formBuilder: FormBuilder) {
  //   this.addEquipoForm = this.formBuilder.group({
  //     nombreEquipo: ['', Validators.required],
  //     pais: ['', Validators.required],
  //     anioFundacion: ['', Validators.required],
  //     urlImagen: [''],
  //   });
  // }

  // agregarEquipo() {
  //   const nuevoEquipo = this.addEquipoForm.value;
  //   this.equipos.push(nuevoEquipo);
  //   this.addEquipoForm.reset();
  // }

  addTeamForm: FormGroup;
  allTeams: any = [];
  team: any[] = [];

  constructor(
    public form: FormBuilder,
    private authService: AuthService,
    public loadingCtrl: LoadingController,
    public alertController: AlertController,
    private modalCtrl: ModalController,
  ) {
    this.addTeamForm = this.form.group({
      teamName: new FormControl('', [Validators.required]),
      teamCountry: new FormControl('', [Validators.required]),
      teamFounded: new FormControl('', [Validators.required]),
      teamLogoUrl: new FormControl(''),
    })
  }

  ngOnInit() {
    this.getAllTeams()
  }

  async openModal(idUser: any) {
    await this.getTeam(idUser)
    console.log('users', this.team);

    const modal = await this.modalCtrl.create({
      component: TeamDetailsPage,
      componentProps: {
        team: this.team
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role) {
      this.getAllTeams()
    }
  }

  async getTeam(id: any) {
    await loadingSpinner(this.loadingCtrl)
    return new Promise<void>((resolve, reject) => {
      this.authService.call(null, `getTeam/${id}`, 'GET', false).subscribe({
        next: (response) => {
          if (response.status === Constant.SUCCESS) {
            this.team = []
            this.team = response.data
          }

          console.log(this.team);

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


  async addTeam(form: any) {
    await loadingSpinner(this.loadingCtrl)

    let data = {
      name: form.teamName,
      country: form.teamCountry,
      founded: form.teamFounded,
      logo: form.teamLogoUrl
    }

    this.authService.call(data, 'addTeam', 'POST', true).subscribe({
      next: async (response) => {
        if (response.status === Constant.SUCCESS) {
          this.loadingCtrl.dismiss();
          this.getAllTeams()
          alertModal({
            title: response.status,
            text: 'Equipo agregado exitosamente',
            button: [
              {
                cssClass: 'alert-button-confirm',
                text: 'Aceptar',
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

  async getAllTeams() {
    await loadingSpinner(this.loadingCtrl)

    this.authService.call(null, 'getAllTeams', 'GET', true).subscribe({
      next: async (response) => {
        if (response.status === Constant.SUCCESS) {
          this.loadingCtrl.dismiss();

          this.allTeams = response.data
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

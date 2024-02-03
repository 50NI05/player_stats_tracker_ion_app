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
      teamName: new FormControl('', [Validators.required, Validators.pattern(Constant.Pattern.Form.Name), this.validateMaxDigits(50)]),
      teamState: new FormControl('', [Validators.required, Validators.pattern(Constant.Pattern.Form.Name), this.validateMaxDigits(25)]),
      teamFounded: new FormControl('', [Validators.required, this.validateMaxDigits(4)]),
      teamLogoUrl: new FormControl('', [Validators.pattern(Constant.Pattern.Form.HTTP)]),
    })
  }

  ngOnInit() {
    this.getAllTeams()
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

  async openModal(idTeam: any) {
    await this.getTeam(idTeam)
    console.log('team', this.team);

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
        },
      })
    })
  }


  async addTeam(form: any) {
    await loadingSpinner(this.loadingCtrl)

    let data = {
      name: form.teamName,
      country: form.teamState,
      founded: form.teamFounded,
      logo: form.teamLogoUrl
    }

    this.authService.call(data, 'addTeam', 'POST', true).subscribe({
      next: async (response) => {
        if (response.status === Constant.SUCCESS) {
          this.loadingCtrl.dismiss();
          this.getAllTeams()
          alertModal({
            title: 'Equipo Agregado Exitosamente',
            text: 'Felicidades, has agregado el equipo exitosamente',
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
            title: 'Error en la Plataforma',
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
            title: 'Error en la Plataforma.',
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

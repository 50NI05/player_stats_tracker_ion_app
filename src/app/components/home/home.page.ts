import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Chart, Colors } from 'chart.js';
import { AuthService } from 'src/app/services/auth.service';
import { alertModal } from 'src/app/shared/alert/alert.component';
import { Constant } from 'src/app/shared/constant/constant.component';
import { loadingSpinner } from 'src/app/shared/loading/loading.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('chart') chartCanvas!: ElementRef;
  chart!: any;
  datas: any[] = [];

  routesAdmin = [
    {
      title: 'Estadísticas',
      route: '/statistics',
    },
    {
      title: 'Agregar Equipo',
      route: '/add-team',
    },
    {
      title: 'Agregar Jugador',
      route: '/add-player',
    },
    {
      title: 'Ver Usuarios',
      route: '/users',
    },
    {
      title: 'Ver Jugadores',
      route: '/table-players',
    },
    {
      title: 'Asistente Virtual',
      route: '/chat-bot',
    },
  ]

  routesUser = [
    {
      title: 'Estadísticas',
      route: '/statistics',
    },
    {
      title: 'Asistente Virtual',
      route: '/chat-bot',
    },
  ]

  profile: any;

  constructor(
    private authService: AuthService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public form: FormBuilder,
    private ref: ChangeDetectorRef,
    public alertController: AlertController,
  ) {
    this.profile = authService.getProfile()
  }

  ngOnInit() {
    this.player()
  }

  playerChart(type: any) {
    if (this.chart) {
      this.chart.destroy();
      this.player()
    }
  }

  async player() {
    await loadingSpinner(this.loadingCtrl);

    const random = Math.floor(Math.random() * 10) + 1;

    this.authService.call(null, `getPlayer/${random}`, 'GET', true).subscribe({
      next: (response) => {
        this.datas = []
        if (response.status === Constant.SUCCESS) {
          this.datas.push(response.data)
          console.log(this.datas);

          this.loadingCtrl.dismiss()
          this.ref.detectChanges()
          this.generateChartPlayer('bar', this.datas)
        } else {
          console.log(response)
          this.loadingCtrl.dismiss()

          alertModal({
            title: '',
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

  generateChartPlayer(type: any, data: any) {
    const ctx = this.chartCanvas.nativeElement.getContext('2d')

    let dataChart = [
      data[0].statistics.map((e: { shot: { total: null; }; }) => e.shot.total === null ? 3 : e.shot.total)[0],
      data[0].statistics.map((e: { goal: { total: null; }; }) => e.goal.total === null ? 1 : e.goal.total)[0],
      data[0].statistics.map((e: { passe: { total: null; }; }) => e.passe.total === null ? 5 : e.passe.total)[0],
      data[0].statistics.map((e: { tackle: { total: null; }; }) => e.tackle.total === null ? 4 : e.tackle.total)[0],
      data[0].statistics.map((e: { dribble: { success: null; }; }) => e.dribble.success === null ? 2 : e.dribble.success)[0]
    ]

    this.chart = new Chart(ctx, {
      type: type,
      data: {
        labels: ['Disparos', 'Goles', 'Pases', 'Entradas', 'Regates'],
        datasets: [
          {
            label: data[0].player.firstname + ' ' + data[0].player.lastname,
            data: dataChart,
            // borderWidth: 1
          },
          // {
          //   label: 'leyenda',
          //   data: dataChart,
          //   // borderWidth: 1
          // },
        ]
      },
      options: {
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  async logout() {
    await loadingSpinner(this.loadingCtrl)

    let data = {
      idUser: this.authService.getIdUser()
    }

    this.authService.call(data, 'logout', 'POST', true).subscribe({
      next: (response) => {
        console.log(response)
        if (response.status === Constant.SUCCESS) {
          this.authService.setToken(null);
          this.authService.setLogged(false)
          this.authService.setModelSesionInSession(this.authService.modelSession);
          this.authService.setModelLog(this.authService.modelLog);
          this.navCtrl.navigateRoot('login');
          console.log(this.authService.getLogged());
          this.loadingCtrl.dismiss()
        } else {
          console.log(response)
          this.loadingCtrl.dismiss()

          alertModal({
            title: '',
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

import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Chart, Colors } from 'chart.js';
import { AuthService } from 'src/app/services/auth.service';
import { alertModal } from 'src/app/shared/alert/alert.component';
import { Constant } from 'src/app/shared/constant/constant.component';
import { loadingSpinner } from 'src/app/shared/loading/loading.component';
import { ChatBotPage } from '../chat-bot/chat-bot.page';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { StatisticsPage } from '../statistics/statistics.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('chart') chartCanvas!: ElementRef;
  chart!: any;
  datas: any[] = [];
  news: any;

  routesAdmin = [
    // {
    //   title: 'Estadísticas',
    //   route: '/statistics',
    // },
    // {
    //   title: 'Asistente Virtual',
    //   route: '/chat-bot',
    // },
    {
      title: 'Agregar Equipo',
      route: '/add-team',
    },
    {
      title: 'Agregar Jugador',
      route: '/add-player',
    },
    {
      title: 'Ver Jugadores',
      route: '/table-players',
    },
    {
      title: 'Ver Usuarios',
      route: '/users',
    },
  ]

  routesUser = [
    {
      title: 'Estadísticas',
      route: '/statistics',
    },
    // {
    //   title: 'Asistente Virtual',
    //   route: '/chat-bot',
    // },
  ]

  profile: any;

  constructor(
    private authService: AuthService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public form: FormBuilder,
    private ref: ChangeDetectorRef,
    public alertController: AlertController,
    private modalCtrl: ModalController,
    private screenOrientation: ScreenOrientation
  ) {
    this.profile = authService.getProfile()
  }

  ngOnInit() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)

    this.validateSession()
    // this.player()
    this.newsFootball()
  }

  async openModalChat() {
    const modal = await this.modalCtrl.create({
      component: ChatBotPage,
      componentProps: {
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role) {
    }
  }

  isOverThreeLines(text: string): boolean {
    const lineHeight = 16; // Ajusta esto según tu tamaño de línea
    const maxHeight = 3 * lineHeight; // Máximo permitido para tres líneas
    const dummyElement = document.createElement('div');
    dummyElement.style.visibility = 'hidden';
    dummyElement.style.position = 'absolute';
    dummyElement.style.width = '300px'; // Ajusta esto según el ancho del contenedor
    dummyElement.innerHTML = text;
    document.body.appendChild(dummyElement);

    const isOverThreeLines = dummyElement.clientHeight > maxHeight;

    document.body.removeChild(dummyElement);

    return isOverThreeLines;
  }


  async openModalStatistic() {
    const modal = await this.modalCtrl.create({
      component: StatisticsPage,
      componentProps: {
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)
    }
  }

  playerChart(type: any) {
    if (this.chart) {
      this.chart.destroy();
      this.player()
    }
  }

  validateSession() {
    let data = {
      session: this.authService.getToken()
    }

    this.authService.call(data, `validateSession`, 'POST', true).subscribe({
      next: (response) => {
        if (response.status === Constant.SUCCESS) {
          console.log(response);
        }
      },
      error: (error) => {
        console.log(error);

        alertModal({
          title: 'Expiración de la Sesión: Han Pasado 24 Horas',
          text: 'Tu sesión ha expirado debido a inactividad durante las últimas 24 horas. Por favor, vuelve a iniciar sesión para continuar.',
          button: [
            {
              cssClass: 'alert-button-cancel',
              text: 'Cerrar',
              handler: () => {
                this.authService.setToken(null);
                this.authService.setModelSesionInSession(this.authService.modelSession);
                this.navCtrl.navigateRoot('login');
              }
            }
          ],
          alertController: this.alertController
        })
      }
    })
  }

  async newsFootball() {
    await loadingSpinner(this.loadingCtrl);

    this.authService.call(null, `newsFootball`, 'GET', false).subscribe({
      next: (response) => {
        if (response.status === Constant.SUCCESS) {
          this.news = response.data

          this.loadingCtrl.dismiss()
        }
      },
      error: (error) => {
        console.log(error);
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

  async player() {
    await loadingSpinner(this.loadingCtrl);

    const random = Math.floor(Math.random() * 10) + 1;

    this.authService.call(null, `getPlayer/${12}`, 'GET', true).subscribe({
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
            borderColor: 'rgb(94, 33, 41)',
            backgroundColor: 'rgb(94, 33, 41)',
          },
        ]
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: "white",
              font: {
                // size: 15,
                family: 'Poppins',
              }
            }
          }
        },
        scales: {
          y: {
            ticks: {
              color: "white",
              font: {
                // size: 15,
                family: 'Poppins',
              },
              stepSize: 1,
              // beginAtZero: false
            }
          },
          x: {
            ticks: {
              color: "white",
              font: {
                // size: 15,
                family: 'Poppins',
              },
              stepSize: 1,
              // beginAtZero: true
            }
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
          // this.authService.setLogged(false)
          this.authService.setModelSesionInSession(this.authService.modelSession);
          // this.authService.setModelLog(this.authService.modelLog);
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

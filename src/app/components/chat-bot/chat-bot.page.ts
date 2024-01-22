import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, NavController, NavParams } from '@ionic/angular';
import { log } from 'console';
import { AuthService } from 'src/app/services/auth.service';
import { alertModal } from 'src/app/shared/alert/alert.component';
import { Constant } from 'src/app/shared/constant/constant.component';
import { loadingSpinner } from 'src/app/shared/loading/loading.component';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.page.html',
  styleUrls: ['./chat-bot.page.scss'],
})
export class ChatBotPage implements OnInit {
  form: FormGroup;
  questions = []
  dataStatistic1: any;
  dataStatistic2: any;
  data: any

  constructor(
    private authService: AuthService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public fb: FormBuilder,
    private ref: ChangeDetectorRef,
    public alertController: AlertController,
    private modalCtrl: ModalController,
    private navParams: NavParams,
  ) {
    this.form = this.fb.group({
      prompt: new FormControl('', [Validators.required])
    })
  }

  ngOnInit() {
    if (this.navParams.get('statistic1') || this.navParams.get('statistic2')) {
      this.dataStatistic1 = this.navParams.get('statistic1')[0]
      this.dataStatistic2 = this.navParams.get('statistic2')[0]
      console.log(this.dataStatistic1);
      console.log(this.dataStatistic2);

      this.assistant(`A continuación, se presenta un resumen comparativo de las estadísticas de Lionel Messi y Test Prueba:

Lionel Messi, de ${this.dataStatistic1.age} años y nacionalidad ${this.dataStatistic1.nationality}, destaca en la ${this.dataStatistic1.league.name} de ${this.dataStatistic1.league.country}. Durante la temporada ${this.dataStatistic1.league.season}, ha participado en ${this.dataStatistic1.game.appearences} partidos, acumulando ${this.dataStatistic1.game.lineups} titularidades y jugando un total de ${this.dataStatistic1.game.minutes} minutos. Messi, con el dorsal número ${this.dataStatistic1.game.number}, desempeña la posición de ${this.dataStatistic1.game.position} y ha logrado una valoración destacada de ${this.dataStatistic1.game.rating}. Además, ha contribuido con ${this.dataStatistic1.goal.total} goles, ${this.dataStatistic1.goal.assists} asistencias y ${this.dataStatistic1.goal.saves} atajadas como capitán.

Por otro lado, Test Prueba, de ${this.dataStatistic2.age} años y origen ${this.dataStatistic2.nationality}, también compite en la ${this.dataStatistic2.league.name} de ${this.dataStatistic2.league.country} en la temporada ${this.dataStatistic2.league.season}. En su única aparición, ha tenido ${this.dataStatistic2.game.lineups} titularidades y ha jugado ${this.dataStatistic2.game.minutes} minutos como ${this.dataStatistic2.game.position}, con el número ${this.dataStatistic2.game.number}. Su valoración es de ${this.dataStatistic2.game.rating}, habiendo anotado ${this.dataStatistic2.goal.total} goles y realizado ${this.dataStatistic2.goal.assists} asistencias. Test Prueba ha registrado ${this.dataStatistic2.goal.saves} atajadas y ha evitado ${this.dataStatistic2.penalty.saved} penales como parte de su destacada actuación.

Ambos jugadores tienen características únicas y contribuyen de manera significativa a sus respectivos equipos.` + '\n\n\n' + 'Deseo un análisis comparativos')
    }
    this.listQuestions()
  }

  messages: { text: string; isSender: boolean }[] = [];
  newMessage: string = '';

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }

  async assistant(form: any) {
    // if (this.newMessage.trim() !== '') {
    //   this.messages.push({ text: this.newMessage, isSender: true });
    //   this.newMessage = '';
    //   setTimeout(() => {
    //     this.messages.push({
    //       text: 'Respuesta del destinatario...',
    //       isSender: false,
    //     });
    //   }, 1000);
    // }
    console.log(this.form.controls['prompt'].value);
    if (form.prompt !== '' || form !== '') {
      await loadingSpinner(this.loadingCtrl)

      if (form.prompt !== '' && form.prompt !== undefined) {
        this.messages.push({ text: form.prompt, isSender: true });

        this.data = {
          prompt: form.prompt
        }
      } else {
        this.messages.push({ text: form, isSender: true });

        this.data = {
          prompt: form
        }
      }

      console.log(this.data);


      this.form.reset()

      this.authService.call(this.data, 'assistant', 'POST', true).subscribe({
        next: (response) => {
          console.log(response)
          if (response.status === Constant.SUCCESS) {
            setTimeout(() => {
              this.messages.push({
                text: response.data.content,
                isSender: false,
              });
            }, 1000);

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

      this.listQuestions()
    }
  }

  async message(prompt: any) {
    if (prompt !== '') {
      this.messages.push({ text: prompt, isSender: true });

      await loadingSpinner(this.loadingCtrl)

      let data = {
        prompt: prompt
      }

      this.authService.call(data, 'message', 'POST', true).subscribe({
        next: (response) => {
          console.log(response)
          if (response.status === Constant.SUCCESS) {
            setTimeout(() => {
              this.messages.push({
                text: response.data,
                isSender: false,
              });
            }, 1000);

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

      this.listQuestions()
    }
  }

  async listQuestions() {
    await loadingSpinner(this.loadingCtrl)

    this.authService.call(null, 'listQuestions', 'GET', true).subscribe({
      next: (response) => {
        console.log(response)
        this.questions = []
        if (response.status === Constant.SUCCESS) {
          this.questions = response.data

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
}

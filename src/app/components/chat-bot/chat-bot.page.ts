import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AlertController, LoadingController, ModalController, NavController, NavParams } from '@ionic/angular';
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
      prompt: new FormControl('')
    })
  }

  ngOnInit() {
    if (this.navParams.get('statistic1') || this.navParams.get('statistic2')) {
      this.dataStatistic1 = this.navParams.get('statistic1')[0]
      this.dataStatistic2 = this.navParams.get('statistic2')[0]
      console.log(this.navParams.get('statistic1'));
      console.log(this.navParams.get('statistic2'));

      this.assistant(JSON.stringify(this.dataStatistic1) + '\n\n\n' + JSON.stringify(this.dataStatistic2) + '\n\n\n' + 'en forma de tabla')
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
      this.messages.push({ text: this.form.controls['prompt'].value, isSender: true });

      await loadingSpinner(this.loadingCtrl)

      if (form.prompt !== '' && form.prompt !== undefined) {
        this.data = {
          prompt: form.prompt
        }
      } else {
        this.data = {
          prompt: form
        }
      }

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

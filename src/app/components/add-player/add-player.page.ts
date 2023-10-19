import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { alertModal } from 'src/app/shared/alert/alert.component';
import { loadingSpinner } from 'src/app/shared/loading/loading.component';
import { MaskitoOptions, MaskitoElementPredicateAsync } from '@maskito/core';
import { Constant } from 'src/app/shared/constant/constant.component';

@Component({
  selector: 'app-add-player',
  templateUrl: './add-player.page.html',
  styleUrls: ['./add-player.page.scss'],
})
export class AddPlayerPage implements OnInit {
  addPlayerForm: FormGroup;
  teams: any = []
  captainList = [
    {
      id: 1,
      description: 'Si',
    },
    {
      id: 0,
      description: 'No',
    }
  ]

  textPattern = /^[a-zA-ZñÑáÁéÉíÍóÓúÚ ]+$/;
  birthPattern = /^(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[0-2])[-/]\d{4}$/;

  readonly maskitoOptions: MaskitoOptions = {
    mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
  };

  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    private authService: AuthService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController
  ) {
    this.addPlayerForm = this.fb.group({
      player: new FormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern(Constant.Pattern.Form.Name)]),
        firstname: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern(Constant.Pattern.Form.Name)]),
        lastname: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern(Constant.Pattern.Form.Name)]),
        age: new FormControl('', [Validators.required, this.validateMaxDigits(2)]),
        birth: new FormControl('', [Validators.required, this.validateMaxDigits(10), Validators.pattern(this.birthPattern)]),
        nationality: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern(Constant.Pattern.Form.Name)]),
        height: new FormControl('', [Validators.required, this.validateMaxDigits(4)]),
        weight: new FormControl('', [Validators.required, this.validateMaxDigits(4)]),
        photo: new FormControl(''),
        id_team: new FormControl('', [Validators.required]),
      }),
      game: new FormGroup({
        appearences: new FormControl('', [Validators.required, this.validateMaxDigits(3)]),
        lineups: new FormControl('', [Validators.required, this.validateMaxDigits(3)]),
        minutes: new FormControl('', [Validators.required, this.validateMaxDigits(5)]),
        number: new FormControl('', [Validators.required, this.validateMaxDigits(2)]),
        position: new FormControl('', [Validators.required, Validators.maxLength(20), Validators.pattern(Constant.Pattern.Form.Name)]),
        rating: new FormControl('', [Validators.required, this.validateMaxDigits(2)]),
        captain: new FormControl('', [Validators.required])
      }),
      substitute: new FormGroup({
        in: new FormControl('', [Validators.required, this.validateMaxDigits(2)]),
        out: new FormControl('', [Validators.required, this.validateMaxDigits(2)]),
        bench: new FormControl('', [Validators.required, this.validateMaxDigits(2)])
      }),
      shot: new FormGroup({
        total: new FormControl('', [Validators.required, this.validateMaxDigits(3)]),
        on: new FormControl('', [Validators.required, this.validateMaxDigits(3)])
      }),
      goal: new FormGroup({
        total: new FormControl('', [Validators.required, this.validateMaxDigits(3)]),
        conceded: new FormControl('', [Validators.required, this.validateMaxDigits(3)]),
        assists: new FormControl('', [Validators.required, this.validateMaxDigits(3)]),
        saves: new FormControl('', [Validators.required, this.validateMaxDigits(3)])
      }),
      passe: new FormGroup({
        total: new FormControl('', [Validators.required, this.validateMaxDigits(3)]),
        key: new FormControl('', [Validators.required, this.validateMaxDigits(3)]),
        accuracy: new FormControl('', [Validators.required, this.validateMaxDigits(3)])
      }),
      tackle: new FormGroup({
        total: new FormControl('', [Validators.required, this.validateMaxDigits(3)]),
        blocks: new FormControl('', [Validators.required, this.validateMaxDigits(3)]),
        interceptions: new FormControl('', [Validators.required, this.validateMaxDigits(3)])
      }),
      duel: new FormGroup({
        total: new FormControl('', [Validators.required, this.validateMaxDigits(3)]),
        won: new FormControl('', [Validators.required, this.validateMaxDigits(3)])
      }),
      dribble: new FormGroup({
        attempts: new FormControl('', [Validators.required, this.validateMaxDigits(3)]),
        success: new FormControl('', [Validators.required, this.validateMaxDigits(3)]),
        past: new FormControl('', [Validators.required, this.validateMaxDigits(3)])
      }),
      foul: new FormGroup({
        drawn: new FormControl('', [Validators.required, this.validateMaxDigits(3)]),
        committed: new FormControl('', [Validators.required, this.validateMaxDigits(3)])
      }),
      card: new FormGroup({
        yellow: new FormControl('', [Validators.required, this.validateMaxDigits(2)]),
        yellowred: new FormControl('', [Validators.required, this.validateMaxDigits(2)]),
        red: new FormControl('', [Validators.required, this.validateMaxDigits(2)])
      }),
      penalty: new FormGroup({
        won: new FormControl('', [Validators.required, this.validateMaxDigits(2)]),
        committed: new FormControl('', [Validators.required, this.validateMaxDigits(2)]),
        scored: new FormControl('', [Validators.required, this.validateMaxDigits(2)]),
        missed: new FormControl('', [Validators.required, this.validateMaxDigits(2)]),
        saved: new FormControl('', [Validators.required, this.validateMaxDigits(2)])
      }),
    })
  }

  ngOnInit() {
    this.getAllTeams()
  }

  validateText(event: KeyboardEvent) {
    let regex = RegExp(this.textPattern);
    return regex.test(event.key);
  }

  checkText(control: any) {
    if (this.addPlayerForm.get(control)?.value[0] === ' ') {
      this.addPlayerForm.get(control)?.reset();
    }
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

  getAllTeams() {
    this.authService.call(null, 'getAllTeams', 'GET', true).subscribe({
      next: (response) => {
        if (response.status === Constant.SUCCESS) {
          response.data.map((e: {
            id: any; name: any;
            country: string;
            founded: any;
            logo: string;
          },) => {
            this.teams.push({
              id: e.id,
              name: e.name,
              country: e.country,
              founded: e.founded,
              logo: e.logo,
            })
          })
          this.teams.sort((a: { name: string; }, b: { name: string; }) => (a.name < b.name) ? -1 : 1)
        } else {
          console.log(response)
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

  async addPlayer() {
    await loadingSpinner(this.loadingCtrl)

    let data = {
      appearences: parseInt(this.addPlayerForm.controls['game'].value.appearences),
      lineups: parseInt(this.addPlayerForm.controls['game'].value.lineups),
      minutes: parseInt(this.addPlayerForm.controls['game'].value.minutes),
      number: parseInt(this.addPlayerForm.controls['game'].value.number),
      position: this.addPlayerForm.controls['game'].value.position,
      rating: parseInt(this.addPlayerForm.controls['game'].value.rating),
      captain: parseInt(this.addPlayerForm.controls['game'].value.captain),
      in: parseInt(this.addPlayerForm.controls['substitute'].value.in),
      out: parseInt(this.addPlayerForm.controls['substitute'].value.out),
      bench: parseInt(this.addPlayerForm.controls['substitute'].value.bench),
      shotTotal: parseInt(this.addPlayerForm.controls['shot'].value.total),
      shotOn: parseInt(this.addPlayerForm.controls['shot'].value.on),
      goalTotal: parseInt(this.addPlayerForm.controls['goal'].value.total),
      conceded: parseInt(this.addPlayerForm.controls['goal'].value.conceded),
      assists: parseInt(this.addPlayerForm.controls['goal'].value.assists),
      saves: parseInt(this.addPlayerForm.controls['goal'].value.saves),
      passeTotal: parseInt(this.addPlayerForm.controls['passe'].value.total),
      key: parseInt(this.addPlayerForm.controls['passe'].value.key),
      accuracy: parseInt(this.addPlayerForm.controls['passe'].value.accuracy),
      tackleTotal: parseInt(this.addPlayerForm.controls['tackle'].value.total),
      blocks: parseInt(this.addPlayerForm.controls['tackle'].value.blocks),
      interceptions: parseInt(this.addPlayerForm.controls['tackle'].value.interceptions),
      duelTotal: parseInt(this.addPlayerForm.controls['duel'].value.total),
      duelWon: parseInt(this.addPlayerForm.controls['duel'].value.won),
      attempts: parseInt(this.addPlayerForm.controls['dribble'].value.attempts),
      success: parseInt(this.addPlayerForm.controls['dribble'].value.success),
      past: parseInt(this.addPlayerForm.controls['dribble'].value.past),
      drawn: parseInt(this.addPlayerForm.controls['foul'].value.drawn),
      foulCommitted: parseInt(this.addPlayerForm.controls['foul'].value.committed),
      yellow: parseInt(this.addPlayerForm.controls['card'].value.yellow),
      yellowred: parseInt(this.addPlayerForm.controls['card'].value.yellowred),
      red: parseInt(this.addPlayerForm.controls['card'].value.red),
      penaltyWon: parseInt(this.addPlayerForm.controls['penalty'].value.won),
      penaltyCommitted: parseInt(this.addPlayerForm.controls['penalty'].value.committed),
      scored: parseInt(this.addPlayerForm.controls['penalty'].value.scored),
      missed: parseInt(this.addPlayerForm.controls['penalty'].value.missed),
      saved: parseInt(this.addPlayerForm.controls['penalty'].value.saved),
      name: this.addPlayerForm.controls['player'].value.name,
      firstname: this.addPlayerForm.controls['player'].value.firstname,
      lastname: this.addPlayerForm.controls['player'].value.lastname,
      age: parseInt(this.addPlayerForm.controls['player'].value.age),
      birth: new Date(this.addPlayerForm.controls['player'].value.birth),
      nationality: this.addPlayerForm.controls['player'].value.nationality,
      height: this.addPlayerForm.controls['player'].value.height,
      weight: this.addPlayerForm.controls['player'].value.weight,
      photo: this.addPlayerForm.controls['player'].value.photo,
      id_team: parseInt(this.addPlayerForm.controls['player'].value.id_team)
    }

    console.log(data);

    // this.loadingCtrl.dismiss();
    this.authService.call(data, 'addPlayer', 'POST', true).subscribe({
      next: async (response) => {
        if (response.status === Constant.SUCCESS) {
          alertModal({
            title: response.status,
            text: response.data,
            button: [
              {
                cssClass: 'alert-button-confirm',
                text: 'Aceptar',
              }
            ],
            alertController: this.alertController
          })

          this.loadingCtrl.dismiss();

        } else if (response.status === 'ERROR') {
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

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

  readonly maskitoOptionsHeight: MaskitoOptions = {
    mask: [/\d/, '.', /\d/, /\d/],
  };

  readonly maskitoOptionsWeight: MaskitoOptions = {
    mask: [/\d/, /\d/, '.', /\d/],
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
        height: new FormControl('', [Validators.required, Validators.pattern(Constant.Pattern.Form.OnlyDecimal), this.validateMaxDigits(4)]),
        weight: new FormControl('', [Validators.required, Validators.pattern(Constant.Pattern.Form.OnlyDecimal), this.validateMaxDigits(4)]),
        photo: new FormControl('', [Validators.pattern(Constant.Pattern.Form.HTTP)]),
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
      market: new FormGroup({
        date: new FormControl('', [Validators.required, this.validateMaxDigits(10), Validators.pattern(this.birthPattern)]),
        marketValue: new FormControl('', [Validators.required, this.validateMaxDigits(4)]),
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
      title: 'Confirmar Agregación de Nuevo Jugador',
      text: '¿Estás seguro de que deseas agregar a este nuevo jugador al equipo? Una vez confirmado, la información será actualizada y el jugador formará parte oficialmente del equipo.',
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
            this.addPlayer(form)
          }
        }
      ],
      alertController: this.alertController
    })
  }

  async addPlayer(form: any) {
    await loadingSpinner(this.loadingCtrl)

    let data = {
      appearences: form.game.appearences,
      lineups: form.game.lineups,
      minutes: form.game.minutes,
      number: form.game.number,
      position: form.game.position,
      rating: form.game.rating,
      captain: form.game.captain,
      in: form.substitute.in,
      out: form.substitute.out,
      bench: form.substitute.bench,
      shotTotal: form.shot.total,
      shotOn: form.shot.on,
      goalTotal: form.goal.total,
      conceded: form.goal.conceded,
      assists: form.goal.assists,
      saves: form.goal.saves,
      passeTotal: form.passe.total,
      key: form.passe.key,
      accuracy: form.passe.accuracy,
      tackleTotal: form.tackle.total,
      blocks: form.tackle.blocks,
      interceptions: form.tackle.interceptions,
      duelTotal: form.duel.total,
      duelWon: form.duel.won,
      attempts: form.dribble.attempts,
      success: form.dribble.success,
      past: form.dribble.past,
      drawn: form.foul.drawn,
      foulCommitted: form.foul.committed,
      yellow: form.card.yellow,
      yellowred: form.card.yellowred,
      red: form.card.red,
      penaltyWon: form.penalty.won,
      penaltyCommitted: form.penalty.committed,
      scored: form.penalty.scored,
      missed: form.penalty.missed,
      saved: form.penalty.saved,
      date: new Date(form.market.date),
      market_value: form.market.marketValue,
      name: form.player.name,
      firstname: form.player.firstname,
      lastname: form.player.lastname,
      age: form.player.age,
      birth: new Date(form.player.birth),
      nationality: form.player.nationality,
      height: form.player.height,
      weight: form.player.weight,
      photo: form.player.photo,
      id_team: form.player.id_team
    }

    console.log(data);

    // this.loadingCtrl.dismiss();
    this.authService.call(data, 'addPlayer', 'POST', true).subscribe({
      next: async (response) => {
        if (response.status === Constant.SUCCESS) {
          alertModal({
            title: 'Nuevo Jugador Agregado',
            text: response.data,
            button: [
              {
                cssClass: 'alert-button-confirm',
                text: 'Aceptar',
              }
            ],
            alertController: this.alertController
          })

          this.addPlayerForm.reset()

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

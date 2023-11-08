import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, NavParams } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { alertModal } from 'src/app/shared/alert/alert.component';
import { Constant } from 'src/app/shared/constant/constant.component';
import { MaskitoOptions, MaskitoElementPredicateAsync } from '@maskito/core';
import { loadingSpinner } from 'src/app/shared/loading/loading.component';

@Component({
  selector: 'app-player-details',
  templateUrl: './player-details.page.html',
  styleUrls: ['./player-details.page.scss'],
})
export class PlayerDetailsPage implements OnInit {
  form: FormGroup;
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

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    public fb: FormBuilder,
    public alertController: AlertController,
    private authService: AuthService,
    public loadingCtrl: LoadingController,
  ) {
    this.form = this.createFormGroup()
  }

  readonly maskitoOptions: MaskitoOptions = {
    mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
  };

  readonly maskPredicate: MaskitoElementPredicateAsync = async (el) => (el as HTMLIonInputElement).getInputElement();


  createFormGroup() {
    return this.fb.group({
      player: new FormGroup({
        name: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern(Constant.Pattern.Form.Name)]),
        firstname: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern(Constant.Pattern.Form.Name)]),
        lastname: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.pattern(Constant.Pattern.Form.Name)]),
        age: new FormControl('', [Validators.required, this.validateMaxDigits(2)]),
        birth: new FormControl('', [Validators.required, this.validateMaxDigits(10)]),
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
      market: new FormGroup({
        date: new FormControl('', [Validators.required, this.validateMaxDigits(10), Validators.pattern(Constant.Pattern.Form.Birthday)]),
        marketValue: new FormControl('', [Validators.required, this.validateMaxDigits(4)]),
      }),
    })
  }

  validateText(event: KeyboardEvent) {
    let regex = RegExp(Constant.Pattern.Form.Name);
    return regex.test(event.key);
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

  ngOnInit() {
    this.getAllTeams()
    this.setValueForm()
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }

  setValueForm() {
    this.form.get('player.firstname')!.setValue(this.navParams.get('detailsPlayer')[0].firstname)
    this.form.get('player.lastname')!.setValue(this.navParams.get('detailsPlayer')[0].lastname)
    this.form.get('player.name')!.setValue(this.navParams.get('detailsPlayer')[0].name)
    this.form.get('player.age')!.setValue(this.navParams.get('detailsPlayer')[0].age)
    this.form.get('player.birth')!.setValue(this.navParams.get('detailsPlayer')[0].birth)
    this.form.get('player.nationality')!.setValue(this.navParams.get('detailsPlayer')[0].nationality)
    this.form.get('player.height')!.setValue(this.navParams.get('detailsPlayer')[0].height)
    this.form.get('player.weight')!.setValue(this.navParams.get('detailsPlayer')[0].weight)
    this.form.get('player.id_team')!.setValue(this.navParams.get('detailsPlayer')[0].team.id)

    this.form.get('game.appearences')!.setValue(this.navParams.get('detailsPlayer')[0].game.appearences)
    this.form.get('game.minutes')!.setValue(this.navParams.get('detailsPlayer')[0].game.minutes)
    this.form.get('game.lineups')!.setValue(this.navParams.get('detailsPlayer')[0].game.lineups)
    this.form.get('game.captain')!.setValue(this.navParams.get('detailsPlayer')[0].game.captain === false ? 0 : 1)
    this.form.get('game.number')!.setValue(this.navParams.get('detailsPlayer')[0].game.number)
    this.form.get('game.position')!.setValue(this.navParams.get('detailsPlayer')[0].game.position)
    this.form.get('game.rating')!.setValue(this.navParams.get('detailsPlayer')[0].game.rating)

    this.form.get('substitute.in')!.setValue(this.navParams.get('detailsPlayer')[0].substitute.in)
    this.form.get('substitute.out')!.setValue(this.navParams.get('detailsPlayer')[0].substitute.out)
    this.form.get('substitute.bench')!.setValue(this.navParams.get('detailsPlayer')[0].substitute.bench)

    this.form.get('shot.total')!.setValue(this.navParams.get('detailsPlayer')[0].shot.total)
    this.form.get('shot.on')!.setValue(this.navParams.get('detailsPlayer')[0].shot.on)

    this.form.get('goal.total')!.setValue(this.navParams.get('detailsPlayer')[0].goal.total)
    this.form.get('goal.assists')!.setValue(this.navParams.get('detailsPlayer')[0].goal.assists)
    this.form.get('goal.conceded')!.setValue(this.navParams.get('detailsPlayer')[0].goal.conceded)
    this.form.get('goal.saves')!.setValue(this.navParams.get('detailsPlayer')[0].goal.saves)

    this.form.get('passe.total')!.setValue(this.navParams.get('detailsPlayer')[0].passe.total)
    this.form.get('passe.key')!.setValue(this.navParams.get('detailsPlayer')[0].passe.key)
    this.form.get('passe.accuracy')!.setValue(this.navParams.get('detailsPlayer')[0].passe.accuracy)

    this.form.get('tackle.total')!.setValue(this.navParams.get('detailsPlayer')[0].tackle.total)
    this.form.get('tackle.blocks')!.setValue(this.navParams.get('detailsPlayer')[0].tackle.blocks)
    this.form.get('tackle.interceptions')!.setValue(this.navParams.get('detailsPlayer')[0].tackle.interceptions)

    this.form.get('duel.total')!.setValue(this.navParams.get('detailsPlayer')[0].duel.total)
    this.form.get('duel.won')!.setValue(this.navParams.get('detailsPlayer')[0].duel.won)

    this.form.get('dribble.attempts')!.setValue(this.navParams.get('detailsPlayer')[0].dribble.attempts)
    this.form.get('dribble.success')!.setValue(this.navParams.get('detailsPlayer')[0].dribble.success)
    this.form.get('dribble.past')!.setValue(this.navParams.get('detailsPlayer')[0].dribble.past)

    this.form.get('foul.drawn')!.setValue(this.navParams.get('detailsPlayer')[0].foul.drawn)
    this.form.get('foul.committed')!.setValue(this.navParams.get('detailsPlayer')[0].foul.committed)

    this.form.get('card.yellow')!.setValue(this.navParams.get('detailsPlayer')[0].card.yellow)
    this.form.get('card.yellowred')!.setValue(this.navParams.get('detailsPlayer')[0].card.yellowred)
    this.form.get('card.red')!.setValue(this.navParams.get('detailsPlayer')[0].card.red)

    this.form.get('penalty.won')!.setValue(this.navParams.get('detailsPlayer')[0].penalty.won)
    this.form.get('penalty.missed')!.setValue(this.navParams.get('detailsPlayer')[0].penalty.missed)
    this.form.get('penalty.committed')!.setValue(this.navParams.get('detailsPlayer')[0].penalty.committed)
    this.form.get('penalty.saved')!.setValue(this.navParams.get('detailsPlayer')[0].penalty.saved)
    this.form.get('penalty.scored')!.setValue(this.navParams.get('detailsPlayer')[0].penalty.scored)
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

  async updatePlayer(form: any) {
    await loadingSpinner(this.loadingCtrl)

    let data = {
      appearences: parseInt(form.game.appearences),
      lineups: parseInt(form.game.lineups),
      minutes: parseInt(form.game.minutes),
      number: parseInt(form.game.number),
      position: form.game.position,
      rating: parseInt(form.game.rating),
      captain: parseInt(form.game.captain),
      in: parseInt(form.substitute.in),
      out: parseInt(form.substitute.out),
      bench: parseInt(form.substitute.bench),
      shotTotal: parseInt(form.shot.total),
      shotOn: parseInt(form.shot.on),
      goalTotal: parseInt(form.goal.total),
      conceded: parseInt(form.goal.conceded),
      assists: parseInt(form.goal.assists),
      saves: parseInt(form.goal.saves),
      passeTotal: parseInt(form.passe.total),
      key: parseInt(form.passe.key),
      accuracy: parseInt(form.passe.accuracy),
      tackleTotal: parseInt(form.tackle.total),
      blocks: parseInt(form.tackle.blocks),
      interceptions: parseInt(form.tackle.interceptions),
      duelTotal: parseInt(form.duel.total),
      duelWon: parseInt(form.duel.won),
      attempts: parseInt(form.dribble.attempts),
      success: parseInt(form.dribble.success),
      past: parseInt(form.dribble.past),
      drawn: parseInt(form.foul.drawn),
      foulCommitted: parseInt(form.foul.committed),
      yellow: parseInt(form.card.yellow),
      yellowred: parseInt(form.card.yellowred),
      red: parseInt(form.card.red),
      penaltyWon: parseInt(form.penalty.won),
      penaltyCommitted: parseInt(form.penalty.committed),
      scored: parseInt(form.penalty.scored),
      missed: parseInt(form.penalty.missed),
      saved: parseInt(form.penalty.saved),
      date: new Date(form.market.date),
      market_value: form.market.marketValue,
      name: form.player.name,
      firstname: form.player.firstname,
      lastname: form.player.lastname,
      age: parseInt(form.player.age),
      birth: new Date(form.player.birth),
      nationality: form.player.nationality,
      height: form.player.height,
      weight: form.player.weight,
      photo: form.player.photo,
      id_team: parseInt(form.player.id_team)
    }

    console.log(data);

    // this.loadingCtrl.dismiss();
    this.authService.call(data, `updatePlayer/${this.navParams.get('detailsPlayer')[0].id}`, 'PATCH', true).subscribe({
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

  test() {
    console.log(this.form.value.player.birth);
    console.log(this.navParams.get('detailsPlayer')[0].birth);

    console.log(new Date(this.form.value.player.birth));
    console.log(new Date(this.navParams.get('detailsPlayer')[0].birth));
  }
}

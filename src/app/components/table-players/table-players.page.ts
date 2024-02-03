import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonModal, LoadingController, ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { alertModal } from 'src/app/shared/alert/alert.component';
import { Constant } from 'src/app/shared/constant/constant.component';
import { loadingSpinner } from 'src/app/shared/loading/loading.component';
import { OverlayEventDetail } from '@ionic/core/components';
import { PlayerDetailsPage } from '../player-details/player-details.page';
// import { Player } from 'src/app/models/player.models';
interface Player {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  age: number,
  birth: string;
  nationality: string;
  height: any,
  weight: any,
  photo: string,
  team: {
    id: number,
    name: string,
    country: string,
    founded: number,
    logo: string,
  },
  league: {
    name: string;
    country: string;
    logo: string;
    season: number;
  }
  game: {
    appearences: number,
    lineups: number,
    minutes: number,
    number: number,
    position: string,
    rating: string,
    captain: boolean
  },
  substitute: {
    in: any,
    out: any,
    bench: any
  },
  shot: {
    total: any,
    on: any
  },
  goal: {
    total: any,
    conceded: any,
    assists: any,
    saves: any
  },
  passe: {
    total: any,
    key: any,
    accuracy: any
  },
  tackle: {
    total: any,
    blocks: any,
    interceptions: any
  },
  duel: {
    total: any,
    won: any
  },
  dribble: {
    attempts: any,
    success: any,
    past: any
  },
  foul: {
    drawn: any,
    committed: any
  },
  card: {
    yellow: any,
    yellowred: any,
    red: any
  },
  penalty: {
    won: any,
    committed: any,
    scored: any,
    missed: any,
    saved: any
  },
  market_value: {
    market_value: any,
    date: any,
    market_value_currency: any
  },
}

@Component({
  selector: 'app-table-players',
  templateUrl: './table-players.page.html',
  styleUrls: ['./table-players.page.scss'],
})
export class TablePlayersPage implements OnInit {
  players: any = [];
  detailsPlayer: Player[] = [];
  form: FormGroup;

  constructor(
    public fb: FormBuilder,
    public alertController: AlertController,
    private authService: AuthService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    private modalCtrl: ModalController,
  ) {
    this.form = this.fb.group({
      filter: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit() {
    this.getAllSquad()
  }

  async openModal(id: any) {
    await this.player1(id)
    console.log(this.detailsPlayer);

    const modal = await this.modalCtrl.create({
      component: PlayerDetailsPage,
      componentProps: {
        detailsPlayer: this.detailsPlayer
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role) {
      this.getAllSquad()
    }
  }

  applyFilter() {
    const searchTerm = this.form.get('filter')?.value.toLowerCase();

    this.players = this.players.filter((player: Player) => {
      return (
        player.name.toLowerCase().includes(searchTerm) ||
        player.firstname.toLowerCase().includes(searchTerm) ||
        player.lastname.toLowerCase().includes(searchTerm) ||
        player.nationality.toLowerCase().includes(searchTerm)
      );
    });
  }

  refreshList() {
    this.form.get('filter')?.setValue('');
    this.getAllSquad()
  }

  async player1(playerId: any) {
    await loadingSpinner(this.loadingCtrl);

    return new Promise<void>((resolve, reject) => {
      this.authService.call(null, `getPlayer/${playerId}`, 'GET', true).subscribe({
        next: (response) => {
          this.detailsPlayer = [];
          if (response.status === Constant.SUCCESS) {
            response.data.statistics.map((
              e: {
                team: { id: any; name: any; country: any; founded: any; logo: any; };
                league: { country: any; logo: any; season: any; name: any; };
                game: { appearences: any, lineups: any, minutes: any, number: any, position: any, rating: any, captain: any };
                substitute: { in: any, out: any, bench: any },
                shot: { total: any, on: any },
                goal: { total: any, conceded: any, assists: any, saves: any };
                passe: { total: any; key: any; accuracy: any; };
                tackle: { total: any; blocks: any; interceptions: any; };
                duel: { total: any, won: any },
                dribble: { attempts: any; success: any; past: any };
                foul: { drawn: any; committed: any; };
                card: { yellow: any, yellowred: any; red: any; };
                penalty: { won: any, committed: any, scored: any, missed: any, saved: any }
              }) => {
              this.detailsPlayer.push({
                id: response.data.player.id,
                name: response.data.player.name,
                firstname: response.data.player.firstname,
                lastname: response.data.player.lastname,
                age: response.data.player.age,
                birth: response.data.player.birth,
                nationality: response.data.player.nationality,
                height: response.data.player.height,
                weight: response.data.player.weight,
                photo: response.data.player.photo,
                team: {
                  id: e.team.id,
                  name: e.team.name,
                  country: e.team.country,
                  founded: e.team.founded,
                  logo: e.team.logo,
                },
                league: {
                  name: e.league.name,
                  country: e.league.country,
                  logo: e.league.logo,
                  season: e.league.season
                },
                game: {
                  appearences: e.game.appearences,
                  lineups: e.game.lineups,
                  minutes: e.game.minutes,
                  number: e.game.number,
                  position: e.game.position,
                  rating: e.game.rating,
                  captain: e.game.captain
                },
                substitute: {
                  in: e.substitute.in,
                  out: e.substitute.out,
                  bench: e.substitute.bench
                },
                shot: {
                  total: e.shot.total,
                  on: e.shot.on
                },
                goal: {
                  total: e.goal.total,
                  conceded: e.goal.conceded,
                  assists: e.goal.assists,
                  saves: e.goal.saves
                },
                passe: {
                  total: e.passe.total,
                  key: e.passe.key,
                  accuracy: e.passe.accuracy
                },
                tackle: {
                  total: e.tackle.total,
                  blocks: e.tackle.blocks,
                  interceptions: e.tackle.interceptions
                },
                duel: {
                  total: e.duel.total,
                  won: e.duel.won
                },
                dribble: {
                  attempts: e.dribble.attempts,
                  success: e.dribble.success,
                  past: e.dribble.past
                },
                foul: {
                  drawn: e.foul.drawn,
                  committed: e.foul.committed,
                },
                card: {
                  yellow: e.card.yellow,
                  yellowred: e.card.yellowred,
                  red: e.card.red
                },
                penalty: {
                  won: e.penalty.won,
                  committed: e.penalty.committed,
                  scored: e.penalty.scored,
                  missed: e.penalty.missed,
                  saved: e.penalty.saved
                },
                market_value: {
                  market_value: response.data.market_value === undefined ? 0 : response.data.market_value.market_value,
                  date: response.data.market_value === undefined ? 0 : response.data.market_value.date,
                  market_value_currency: response.data.market_value === undefined ? '€' : response.data.market_value.market_value_currency
                },
              })
            },
            )
            resolve();
            this.loadingCtrl.dismiss()
          } else {
            console.log(response)
            this.loadingCtrl.dismiss()

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
    })
  }

  async deletePlayer(id: any) {
    await loadingSpinner(this.loadingCtrl)

    this.authService.call(null, `deletePlayer/${id}`, 'DELETE', true).subscribe({
      next: (response) => {
        if (response.status === Constant.SUCCESS) {
          this.getAllSquad()
          this.loadingCtrl.dismiss();
        } else {
          console.log(response)
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
        console.log(error)
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

  async getAllSquad() {
    await loadingSpinner(this.loadingCtrl)

    this.authService.call(null, 'getAllSquad', 'GET', true).subscribe({
      next: (response) => {
        if (response.status === Constant.SUCCESS) {
          this.players = response.data
          this.loadingCtrl.dismiss();
        } else {
          console.log(response)
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
        console.log(error)
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
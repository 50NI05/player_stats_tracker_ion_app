import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Chart, ChartItem } from 'chart.js/auto';
import { AuthService } from 'src/app/services/auth.service';
import { loadingSpinner } from 'src/app/shared/loading/loading.component';
import { alertModal } from 'src/app/shared/alert/alert.component';

interface selectTeam1 {
  id: number;
  name: string;
  country: string;
  founded: number;
  logo: string;
}

interface selectTeam2 {
  id: number;
  name: string;
  country: string;
  founded: number;
  logo: string;
}

interface selectSquad1 {
  id: number;
  name: string;
  age: number;
  number: number;
  photo: string;
}

interface selectSquad2 {
  id: number;
  name: string;
  age: number;
  number: number;
  photo: string;
}

interface Players1 {
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
  }
}

interface Players2 {
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
  }
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {

  teams1: selectTeam1[] = []
  teams2: selectTeam2[] = []
  squads1: selectSquad1[] = []
  squads2: selectSquad2[] = []
  players1: Players1[] = []
  players2: Players2[] = []
  formTeams: FormGroup;
  chart1!: Chart
  chart2!: Chart

  constructor(
    private authService: AuthService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public form: FormBuilder,
    private ref: ChangeDetectorRef,
    public alertController: AlertController,
  ) {
    this.formTeams = this.form.group({
      idTeams1: new FormControl('', [Validators.required, e => this.loadSquads1(e)]),
      idTeams2: new FormControl('', [Validators.required, e => this.loadSquads2(e)]),
      idSquad1: new FormControl('', [Validators.required, e => this.loadPlayers1(e)]),
      idSquad2: new FormControl('', [Validators.required, e => this.loadPlayers2(e)]),
    });
  }

  ngOnInit() {
    this.footballTeams1();
    this.footballTeams2();
  }

  loadSquads1(control: AbstractControl) {
    if (control.value !== '' && control.value !== null) {
      this.squads1 = [];
      this.players1 = [];
      this.squad1(control.value);
      this.formTeams.controls['idSquad1'].reset()
    }
    return null;
  }

  loadSquads2(control: AbstractControl) {
    if (control.value !== '' && control.value !== null) {
      this.squads2 = [];
      this.players2 = [];
      this.squad2(control.value);
      this.formTeams.controls['idSquad2'].reset()
    }
    return null;
  }

  loadPlayers1(control: AbstractControl) {
    if (control.value !== '' && control.value !== null) {
      this.players1 = [];
      this.player1(control.value);
      console.log(control.value)
    }
    return null;
  }

  loadPlayers2(control: AbstractControl) {
    if (control.value !== '' && control.value !== null) {
      this.players2 = [];
      this.player2(control.value);
      console.log(control.value)
    }
    return null;
  }

  generateChartPlayer1(type: any) {
    let ctx = document.getElementById('chart1') as ChartItem;

    let dataChart = [
      this.players1.map(e => e.shot.total === null ? 3 : e.shot.total)[0],
      this.players1.map(e => e.goal.total === null ? 1 : e.goal.total)[0],
      this.players1.map(e => e.passe.total === null ? 5 : e.passe.total)[0],
      this.players1.map(e => e.tackle.total === null ? 4 : e.tackle.total)[0],
      this.players1.map(e => e.dribble.success === null ? 2 : e.dribble.success)[0]
    ]

    console.log(dataChart)

    this.chart1 = new Chart(ctx, {
      type: type,
      data: {
        labels: ['Tiros', 'Goles', 'Pases', 'Entradas', 'Regates'],
        datasets: [{
          label: this.players1.map(e => e.name)[0],
          data: dataChart,
          // borderWidth: 1
        }]
      },
    });

    this.chart1.destroy()
  }

  generateChartPlayer2(type: any) {
    let ctx = document.getElementById('chart2') as ChartItem;

    let dataChart2 = [
      this.players2.map(e => e.shot.total === null ? 6 : e.shot.total)[0],
      this.players2.map(e => e.goal.total === null ? 2 : e.goal.total)[0],
      this.players2.map(e => e.passe.total === null ? 4 : e.passe.total)[0],
      this.players2.map(e => e.tackle.total === null ? 5 : e.tackle.total)[0],
      this.players2.map(e => e.dribble.success === null ? 3 : e.dribble.success)[0]
    ]

    this.chart2 = new Chart(ctx, {
      type: type,
      data: {
        labels: ['Tiros', 'Goles', 'Pases', 'Entradas', 'Regates'],
        datasets: [{
          label: this.players2.map(e => e.name)[0],
          data: dataChart2,
          // borderWidth: 1
        }]
      },
    });
  }

  pieChart(type: any) {
    this.chart1.destroy()
    this.chart2.destroy()
    this.generateChartPlayer1(type);
    this.generateChartPlayer2(type);
  }

  lineChart(type: any) {
    this.chart1.destroy()
    this.chart2.destroy()
    this.generateChartPlayer1(type);
    this.generateChartPlayer2(type);
  }

  selectDisabled(list1: any, list2: any) {
    console.log('lista1', list1);
    console.log('lista2', list2);
    if (list1[0] === undefined || list1[0] === null || list2[0] === undefined || list2[0] === null) {
      this.formTeams.get('idSquad1')?.disable()
      this.formTeams.get('idSquad2')?.disable()
    } else {
      this.formTeams.get('idSquad1')?.enable()
      this.formTeams.get('idSquad2')?.enable()
    }
  }

  test() {
    this.navCtrl.navigateRoot('statistics');
  }

  async logout() {
    await loadingSpinner(this.loadingCtrl)

    let data = {
      idUser: this.authService.getIdUser()
    }

    this.authService.call(data, 'logout', 'POST', true).subscribe({
      next: (response) => {
        console.log(response)
        if (response.status === 'SUCCESS') {
          this.authService.setToken(null);
          this.authService.setModelSesionInSession(this.authService.modelSession);
          this.navCtrl.navigateRoot('login');
          this.loadingCtrl.dismiss()
        } else {
          console.log(response)
          this.loadingCtrl.dismiss()

          alertModal({
            title: response.status,
            text: response.data,
            button: ['Cerrar'],
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
          button: ['Cerrar'],
          alertController: this.alertController
        })
      }
    })
  }

  footballTeams1() {
    this.authService.call(null, 'getAllTeams', 'GET', true).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS') {
          response.data.map((e: {
            id: any; name: any;
            country: string;
            founded: any;
            logo: string;
          },) => {
            this.teams1.push({
              id: e.id,
              name: e.name,
              country: e.country,
              founded: e.founded,
              logo: e.logo,
            })
          })
          this.teams1.sort((a, b) => (a.name < b.name) ? -1 : 1)
        } else {
          console.log(response)
        }
      },
      error: (error) => {
        console.log(error)

        alertModal({
          title: 'Error',
          text: 'Falla en el servidor',
          button: ['Cerrar'],
          alertController: this.alertController
        })
      }
    })
  }

  footballTeams2() {
    this.authService.call(null, 'getAllTeams', 'GET', true).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS') {
          response.data.map((e: {
            id: any; name: any;
            country: string;
            founded: any;
            logo: string;
          }) => {
            this.teams2.push({
              id: e.id,
              name: e.name,
              country: e.country,
              founded: e.founded,
              logo: e.logo,
            })
          })
          this.teams2.sort((a, b) => (a.name < b.name) ? -1 : 1)
        } else {
          console.log(response)
        }
      },
      error: (error) => {
        console.log(error)

        alertModal({
          title: 'Error',
          text: 'Falla en el servidor',
          button: ['Cerrar'],
          alertController: this.alertController
        })
      }
    })
  }

  async squad1(teamID: any) {
    await loadingSpinner(this.loadingCtrl)

    this.authService.call(null, `getSquad/${teamID}`, 'GET', true).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS') {
          response.data.map((e: {
            age: number;
            photo: string;
            id: any; name: any;
            number: any
          }) => {
            this.squads1.push({
              id: e.id,
              name: e.name,
              age: e.age,
              number: e.number,
              photo: e.photo,
            })
          })
          this.squads1.sort((a, b) => (a.name < b.name) ? -1 : 1)
          this.loadingCtrl.dismiss();

          // this.selectDisabled(this.squads1, this.squads2)
        } else {
          console.log(response)
          this.loadingCtrl.dismiss();
        }
      },
      error: (error) => {
        console.log(error)
        this.loadingCtrl.dismiss();

        alertModal({
          title: 'Error',
          text: 'Falla en el servidor',
          button: ['Cerrar'],
          alertController: this.alertController
        })
      }
    })
  }

  async squad2(teamID: any) {
    await loadingSpinner(this.loadingCtrl)

    this.authService.call(null, `getSquad/${teamID}`, 'GET', true).subscribe({
      next: (response) => {
        if (response.status === 'SUCCESS') {
          response.data.map((e: {
            age: number;
            photo: string;
            id: any; name: any;
            number: any
          }) => {
            this.squads2.push({
              id: e.id,
              name: e.name,
              age: e.age,
              number: e.number,
              photo: e.photo,
            })
          })
          this.squads2.sort((a, b) => (a.name < b.name) ? -1 : 1)
          this.loadingCtrl.dismiss();

          // this.selectDisabled(this.squads1, this.squads2)
        } else {
          console.log(response)
          this.loadingCtrl.dismiss();
        }
      },
      error: (error) => {
        console.log(error)
        this.loadingCtrl.dismiss();

        alertModal({
          title: 'Error',
          text: 'Falla en el servidor',
          button: ['Cerrar'],
          alertController: this.alertController
        })
      }
    })
  }

  async player1(playerId: any) {
    await loadingSpinner(this.loadingCtrl);

    this.authService.call(null, `getPlayer/${playerId}`, 'GET', true).subscribe({
      next: (response) => {
        console.log(response)
        if (response.status === 'SUCCESS') {
          response.data.statistics.map((
            e: {
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
            this.players1.push({
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
              }
            })
          },
          )
          this.loadingCtrl.dismiss()
          this.ref.detectChanges()
          this.generateChartPlayer1('line')
        } else {
          console.log(response)
          this.loadingCtrl.dismiss()
        }
      },
      error: (error) => {
        console.log(error);
        this.loadingCtrl.dismiss()

        alertModal({
          title: 'Error',
          text: 'Falla en el servidor',
          button: ['Cerrar'],
          alertController: this.alertController
        })
      }
    })
  }

  async player2(playerId: any) {
    await loadingSpinner(this.loadingCtrl);

    this.authService.call(null, `getPlayer/${playerId}`, 'GET', true).subscribe({
      next: (response) => {
        console.log(response)
        if (response.status === 'SUCCESS') {
          response.data.statistics?.map((
            e: {
              league: { country: string; logo: string; season: number; name: any; };
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
            this.players2.push({
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
              }
            })
          })
          this.loadingCtrl.dismiss()
          this.ref.detectChanges()
          this.generateChartPlayer2('line')
        } else {
          console.log(response)
          this.loadingCtrl.dismiss()
        }
      },
      error: (error) => {
        console.log(error);
        this.loadingCtrl.dismiss()

        alertModal({
          title: 'Error',
          text: 'Falla en el servidor',
          button: ['Cerrar'],
          alertController: this.alertController
        })
      }
    })
  }

}

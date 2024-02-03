import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Chart, ChartItem } from 'chart.js/auto';
import { AuthService } from 'src/app/services/auth.service';
import { loadingSpinner } from 'src/app/shared/loading/loading.component';
import { alertModal } from 'src/app/shared/alert/alert.component';
import { Constant } from 'src/app/shared/constant/constant.component';
import { DatePipe } from '@angular/common';
import { ChatBotPage } from '../chat-bot/chat-bot.page';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { Platform } from '@ionic/angular';
import { File } from "@awesome-cordova-plugins/file";
import { FileOpener } from "@awesome-cordova-plugins/file-opener";
import { Filesystem, Directory } from "@capacitor/filesystem";

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

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
  },
  market_value: {
    market_value: any,
    date: any,
    market_value_currency: any
  },
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
  market_value: {
    market_value: any,
    date: any,
    market_value_currency: any
  },
}

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class StatisticsPage implements OnInit {
  @ViewChild('chart1') chartCanvas1!: ElementRef;
  @ViewChild('chart2') chartCanvas2!: ElementRef;

  teams1: selectTeam1[] = [];
  teams2: selectTeam2[] = [];
  squads1: selectSquad1[] = [];
  squads2: selectSquad2[] = [];
  players1: Players1[] = [];
  players2: Players2[] = [];
  formTeams: FormGroup;
  chart1!: any;
  chart2!: any;
  dataChart: any;
  dataChart2: any;
  profile = this.authService.getProfile();
  band = false;
  pdfObj: any;

  constructor(
    private authService: AuthService,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public form: FormBuilder,
    private ref: ChangeDetectorRef,
    public alertController: AlertController,
    private datePipe: DatePipe,
    private modalCtrl: ModalController,
    private screenOrientation: ScreenOrientation,
    private platform: Platform,
  ) {
    this.formTeams = this.form.group({
      idTeams1: new FormControl('', [Validators.required, e => this.loadSquads1(e)]),
      idTeams2: new FormControl('', [Validators.required, e => this.loadSquads2(e)]),
      idSquad1: new FormControl('', [Validators.required, e => this.loadPlayers1(e)]),
      idSquad2: new FormControl('', [Validators.required, e => this.loadPlayers2(e)]),
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(null, 'confirm');
  }

  pdfDownload() {
    let playersArrayTop = [];
    playersArrayTop.push([
      { text: 'Minutos jugados', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Goles', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Asistencias', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Pases precisos', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Tiros totales', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
    ])

    let playersArrayMarket = [];
    playersArrayMarket.push([
      { text: 'Valor de mercado actual', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Última revisión', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
    ])

    let playersArrayShot = []
    playersArrayShot.push([
      { text: 'Tiros totales', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Tiros al arcos', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
    ])

    let playersArrayGoal = []
    playersArrayGoal.push([
      { text: 'Goles totales', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Asistencias', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Recibidos', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Salvados', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
    ])

    let playersArraySubstitute = []
    playersArraySubstitute.push([
      { text: 'Ingresos', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Sustitutos', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Banqueados', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
    ])

    let playersArrayPasse = []
    playersArrayPasse.push([
      { text: 'Pases totales', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Pases claves', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Pases precisos', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
    ])

    let playersArrayTackle = []
    playersArrayTackle.push([
      { text: 'Entradas totales', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Bloqueadas', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Intercepciones', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
    ])

    let playersArrayDribble = []
    playersArrayDribble.push([
      { text: 'Regates exitosos', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Intentos de Regates', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Promedio de Regates', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
    ])

    let playersArrayDuel = []
    playersArrayDuel.push([
      { text: 'Duelos totales', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Duelos ganados', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
    ])

    let playersArrayFoul = []
    playersArrayFoul.push([
      { text: 'Faltas Realizadas', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Faltas Duras', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
    ])

    let playersArrayCard = []
    playersArrayCard.push([
      { text: 'Tarjetas amarillas', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Tarjetas rojas', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
    ])

    let playersArrayPenalty = []
    playersArrayPenalty.push([
      { text: 'Penaltis ganados', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Penaltis cometidos', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Penaltis marcados', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Penaltis fallados', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
      { text: 'Penaltis parados', style: 'subheader', fillColor: '#2B5178', color: 'white', alignment: 'center' },
    ])

    for (let item of this.players1) {
      playersArrayTop.push([
        { text: item.game.minutes, alignment: 'center' },
        { text: item.goal.total, alignment: 'center' },
        { text: item.goal.assists, alignment: 'center' },
        { text: item.passe.accuracy, alignment: 'center' },
        { text: item.shot.total, alignment: 'center' },
      ]);

      playersArrayMarket.push([
        { text: item.market_value.market_value + ' mil ' + item.market_value.market_value_currency, alignment: 'center' },
        { text: item.market_value.date, alignment: 'center' },
      ]);

      playersArrayShot.push([
        { text: item.shot.total, alignment: 'center' },
        { text: item.shot.on, alignment: 'center' },
      ]);

      playersArrayGoal.push([
        { text: item.goal.total, alignment: 'center' },
        { text: item.goal.assists, alignment: 'center' },
        { text: item.goal.conceded, alignment: 'center' },
        { text: item.goal.saves, alignment: 'center' },
      ]);

      playersArraySubstitute.push([
        { text: item.substitute.in, alignment: 'center' },
        { text: item.substitute.out, alignment: 'center' },
        { text: item.substitute.bench, alignment: 'center' },
      ]);

      playersArrayPasse.push([
        { text: item.passe.total, alignment: 'center' },
        { text: item.passe.key, alignment: 'center' },
        { text: item.passe.accuracy, alignment: 'center' },
      ]);

      playersArrayTackle.push([
        { text: item.tackle.total, alignment: 'center' },
        { text: item.tackle.blocks, alignment: 'center' },
        { text: item.tackle.interceptions, alignment: 'center' },
      ]);

      playersArrayDribble.push([
        { text: item.dribble.attempts, alignment: 'center' },
        { text: item.dribble.success, alignment: 'center' },
        { text: item.dribble.past + '%', alignment: 'center' },
      ]);

      playersArrayDuel.push([
        { text: item.duel.total, alignment: 'center' },
        { text: item.duel.won, alignment: 'center' },
      ]);

      playersArrayFoul.push([
        { text: item.foul.drawn, alignment: 'center' },
        { text: item.foul.committed, alignment: 'center' },
      ]);

      playersArrayCard.push([
        { text: item.card.yellow, alignment: 'center' },
        { text: item.card.red, alignment: 'center' },
      ]);

      playersArrayPenalty.push([
        { text: item.penalty.won, alignment: 'center' },
        { text: item.penalty.committed, alignment: 'center' },
        { text: item.penalty.scored, alignment: 'center' },
        { text: item.penalty.missed, alignment: 'center' },
        { text: item.penalty.saved, alignment: 'center' },
      ]);
    }

    for (let item of this.players2) {
      playersArrayTop.push([
        { text: item.game.minutes, alignment: 'center' },
        { text: item.goal.total, alignment: 'center' },
        { text: item.goal.assists, alignment: 'center' },
        { text: item.passe.accuracy, alignment: 'center' },
        { text: item.shot.total, alignment: 'center' },
      ]);

      playersArrayMarket.push([
        { text: item.market_value.market_value + ' mil ' + item.market_value.market_value_currency, alignment: 'center' },
        { text: item.market_value.date, alignment: 'center' },
      ]);

      playersArrayShot.push([
        { text: item.shot.total, alignment: 'center' },
        { text: item.shot.on, alignment: 'center' },
      ]);

      playersArrayGoal.push([
        { text: item.goal.total, alignment: 'center' },
        { text: item.goal.assists, alignment: 'center' },
        { text: item.goal.conceded, alignment: 'center' },
        { text: item.goal.saves, alignment: 'center' },
      ]);

      playersArraySubstitute.push([
        { text: item.substitute.in, alignment: 'center' },
        { text: item.substitute.out, alignment: 'center' },
        { text: item.substitute.bench, alignment: 'center' },
      ]);

      playersArrayPasse.push([
        { text: item.passe.total, alignment: 'center' },
        { text: item.passe.key, alignment: 'center' },
        { text: item.passe.accuracy, alignment: 'center' },
      ]);

      playersArrayTackle.push([
        { text: item.tackle.total, alignment: 'center' },
        { text: item.tackle.blocks, alignment: 'center' },
        { text: item.tackle.interceptions, alignment: 'center' },
      ]);

      playersArrayDribble.push([
        { text: item.dribble.attempts, alignment: 'center' },
        { text: item.dribble.success, alignment: 'center' },
        { text: item.dribble.past + '%', alignment: 'center' },
      ]);

      playersArrayDuel.push([
        { text: item.duel.total, alignment: 'center' },
        { text: item.duel.won, alignment: 'center' },
      ]);

      playersArrayFoul.push([
        { text: item.foul.drawn, alignment: 'center' },
        { text: item.foul.committed, alignment: 'center' },
      ]);

      playersArrayCard.push([
        { text: item.card.yellow, alignment: 'center' },
        { text: item.card.red, alignment: 'center' },
      ]);

      playersArrayPenalty.push([
        { text: item.penalty.won, alignment: 'center' },
        { text: item.penalty.committed, alignment: 'center' },
        { text: item.penalty.scored, alignment: 'center' },
        { text: item.penalty.missed, alignment: 'center' },
        { text: item.penalty.saved, alignment: 'center' },
      ]);
    }

    const table1 = {
      style: 'tableExample',
      table: {
        widths: [45, '*', 50, 40, 40],
        body: [
          playersArrayTop[0],
          ...playersArrayTop.slice(1, this.players1.length + 1),
        ]
      },
    };

    const table3 = {
      style: 'tableExample',
      table: {
        widths: ['*', '*'],
        body: [
          playersArrayMarket[0],
          ...playersArrayMarket.slice(1, this.players1.length + 1),
        ]
      },
    };

    const table5 = {
      style: 'tableExample',
      table: {
        widths: ['*', '*'],
        body: [
          playersArrayShot[0],
          ...playersArrayShot.slice(1, this.players1.length + 1),
        ]
      },
    };

    const table7 = {
      style: 'tableExample',
      table: {
        widths: ['*', '*', '*', '*'],
        body: [
          playersArrayGoal[0],
          ...playersArrayGoal.slice(1, this.players1.length + 1),
        ]
      },
    };

    const table9 = {
      style: 'tableExample',
      table: {
        widths: ['*', '*', '*'],
        body: [
          playersArraySubstitute[0],
          ...playersArraySubstitute.slice(1, this.players1.length + 1),
        ]
      },
    };

    const table11 = {
      style: 'tableExample',
      table: {
        widths: ['*', '*', '*'],
        body: [
          playersArrayPasse[0],
          ...playersArrayPasse.slice(1, this.players1.length + 1),
        ]
      },
    };

    const table13 = {
      style: 'tableExample',
      table: {
        widths: ['*', '*', '*'],
        body: [
          playersArrayTackle[0],
          ...playersArrayTackle.slice(1, this.players1.length + 1),
        ]
      },
    };

    const table15 = {
      style: 'tableExample',
      table: {
        widths: ['*', '*', '*'],
        body: [
          playersArrayDribble[0],
          ...playersArrayDribble.slice(1, this.players1.length + 1),
        ]
      },
    };

    const table17 = {
      style: 'tableExample',
      table: {
        widths: ['*', '*'],
        body: [
          playersArrayDuel[0],
          ...playersArrayDuel.slice(1, this.players1.length + 1),
        ]
      },
    };

    const table19 = {
      style: 'tableExample',
      table: {
        widths: ['*', '*'],
        body: [
          playersArrayFoul[0],
          ...playersArrayFoul.slice(1, this.players1.length + 1),
        ]
      },
    };

    const table21 = {
      style: 'tableExample',
      table: {
        widths: ['*', '*'],
        body: [
          playersArrayCard[0],
          ...playersArrayCard.slice(1, this.players1.length + 1),
        ]
      },
    };

    const table23 = {
      style: 'tableExample',
      table: {
        widths: [45, 45, 45, 40, 40],
        body: [
          playersArrayPenalty[0],
          ...playersArrayPenalty.slice(1, this.players1.length + 1),
        ]
      },
    };

    const headerRowTop = playersArrayTop[0].map(cell => ({ ...cell }));
    const headerRowMarket = playersArrayMarket[0].map(cell => ({ ...cell }));
    const headerRowShot = playersArrayShot[0].map(cell => ({ ...cell }));
    const headerRowGoal = playersArrayGoal[0].map(cell => ({ ...cell }));
    const headerRowSubstitute = playersArraySubstitute[0].map(cell => ({ ...cell }));
    const headerRowPasse = playersArrayPasse[0].map(cell => ({ ...cell }));
    const headerRowTackle = playersArrayTackle[0].map(cell => ({ ...cell }));
    const headerRowDribble = playersArrayDribble[0].map(cell => ({ ...cell }));
    const headerRowDuel = playersArrayDuel[0].map(cell => ({ ...cell }));
    const headerRowFoul = playersArrayFoul[0].map(cell => ({ ...cell }));
    const headerRowCard = playersArrayCard[0].map(cell => ({ ...cell }));
    const headerRowPenalty = playersArrayPenalty[0].map(cell => ({ ...cell }));

    const table2 = {
      style: 'tableExample',
      table: {
        widths: [45, '*', 50, 40, 40],
        body: [
          headerRowTop,
          ...playersArrayTop.slice(1 + this.players2.length),
        ]
      },
    };

    const table4 = {
      style: 'tableExample',
      table: {
        widths: ['*', '*'],
        body: [
          headerRowMarket,
          ...playersArrayMarket.slice(1 + this.players2.length),
        ]
      },
    };

    const table6 = {
      style: 'tableExample',
      table: {
        widths: ['*', '*'],
        body: [
          headerRowShot,
          ...playersArrayShot.slice(1 + this.players2.length),
        ]
      },
    };

    const table8 = {
      style: 'tableExample',
      table: {
        widths: ['*', '*', '*', '*'],
        body: [
          headerRowGoal,
          ...playersArrayGoal.slice(1 + this.players2.length),
        ]
      },
    };

    const table10 = {
      style: 'tableExample',
      table: {
        widths: ['*', '*', '*'],
        body: [
          headerRowSubstitute,
          ...playersArraySubstitute.slice(1 + this.players2.length),
        ]
      },
    };

    const table12 = {
      style: 'tableExample',
      table: {
        widths: ['*', '*', '*'],
        body: [
          headerRowPasse,
          ...playersArrayPasse.slice(1 + this.players2.length),
        ]
      },
    };

    const table14 = {
      style: 'tableExample',
      table: {
        widths: ['*', '*', '*'],
        body: [
          headerRowTackle,
          ...playersArrayTackle.slice(1 + this.players2.length),
        ]
      },
    };

    const table16 = {
      style: 'tableExample',
      table: {
        widths: ['*', '*', '*'],
        body: [
          headerRowDribble,
          ...playersArrayDribble.slice(1 + this.players2.length),
        ]
      },
    };

    const table18 = {
      style: 'tableExample',
      table: {
        widths: ['*', '*'],
        body: [
          headerRowDuel,
          ...playersArrayDuel.slice(1 + this.players2.length),
        ]
      },
    };

    const table20 = {
      style: 'tableExample',
      table: {
        widths: ['*', '*'],
        body: [
          headerRowFoul,
          ...playersArrayFoul.slice(1 + this.players2.length),
        ]
      },
    };

    const table22 = {
      style: 'tableExample',
      table: {
        widths: ['*', '*'],
        body: [
          headerRowCard,
          ...playersArrayCard.slice(1 + this.players2.length),
        ]
      },
    };

    const table24 = {
      style: 'tableExample',
      table: {
        widths: [45, 45, 45, 40, 40],
        body: [
          headerRowPenalty,
          ...playersArrayPenalty.slice(1 + this.players2.length),
        ]
      },
    };

    let docDef = {
      pageSize: { height: 792, width: 612 },
      content: [
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: `${this.players1[0].name} vs ${this.players2[0].name}\n\n`,
                  alignment: 'center',
                  style: 'header',
                  border: [false, false, false, false],
                  bold: true
                }
              ]
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: [110, '*', 110, '*'],
            body: [
              [
                { text: 'Nombre del Jugador: ', bold: true, border: [false, false, false, false] },
                { text: this.players1[0].name || "No se encontraron datos registrados.", border: [false, false, true, false] },
                { text: 'Nombre del Jugador: ', bold: true, border: [false, false, false, false] },
                { text: this.players2[0].name || "No se encontraron datos registrados.", border: [false, false, false, false] },
              ]
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: [32, '*', 32, '*', 32, '*', 32, '*', 32, '*', 32, '*'],
            body: [
              [
                { text: 'Edad:', bold: true, border: [false, false, false, false] },
                { text: this.players1[0].age || "0", border: [false, false, false, false] },
                { text: 'Altura:', bold: true, border: [false, false, false, false] },
                { text: this.players1[0].height + ' mts' || "0 mts", border: [false, false, false, false] },
                { text: 'Peso:', bold: true, border: [false, false, false, false] },
                { text: this.players1[0].weight + ' kg' || "0 kg", border: [false, false, true, false] },

                { text: 'Edad:', bold: true, border: [false, false, false, false] },
                { text: this.players2[0].age || "0", border: [false, false, false, false] },
                { text: 'Altura:', bold: true, border: [false, false, false, false] },
                { text: this.players2[0].height + ' mts' || "0 mts", border: [false, false, false, false] },
                { text: 'Peso:', bold: true, border: [false, false, false, false] },
                { text: this.players2[0].weight + ' kg' || "0 kg", border: [false, false, false, false] },
              ],
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: [90, '*', 50, '*', 90, '*', 50, '*'],
            body: [
              [
                { text: 'Partidos jugados:', bold: true, border: [false, false, false, false] },
                { text: this.players1[0].game.appearences || "0", border: [false, false, false, false] },
                { text: 'Valoración:', bold: true, border: [false, false, false, false] },
                { text: this.players1[0].game.rating || "0", border: [false, false, true, false] },

                { text: 'Partidos jugados:', bold: true, border: [false, false, false, false] },
                { text: this.players2[0].game.appearences || "0", border: [false, false, false, false] },
                { text: 'Valoración:', bold: true, border: [false, false, false, false] },
                { text: this.players2[0].game.rating || "0", border: [false, false, false, false] },
              ],
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: [50, '*', 40, '*', 50, '*', 40, '*'],
            body: [
              [
                { text: 'Posición:', bold: true, border: [false, false, false, false] },
                { text: this.players1[0].game.position || "No se encontraron datos registrados.", border: [false, false, false, false] },
                { text: 'Capitán:', bold: true, border: [false, false, false, false] },
                { text: this.players1[0].game.captain ? 'Si' : 'No' || "No se encontraron datos registrados.", border: [false, false, true, false] },

                { text: 'Posición:', bold: true, border: [false, false, false, false] },
                { text: this.players2[0].game.position || "No se encontraron datos registrados.", border: [false, false, false, false] },
                { text: 'Capitán:', bold: true, border: [false, false, false, false] },
                { text: this.players2[0].game.captain ? 'Si' : 'No' || "No se encontraron datos registrados.", border: [false, false, false, false] },
              ],
            ]
          }
        },
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: `\nTop estadistísticas`,
                  alignment: 'center',
                  style: 'header',
                  border: [false, false, false, false],
                  bold: true
                }
              ]
            ]
          }
        },
        {
          columns: [
            table1,
            table2,
          ],
        },

        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: `\nValor de mercado`,
                  alignment: 'center',
                  style: 'header',
                  border: [false, false, false, false],
                  bold: true
                }
              ]
            ]
          }
        },
        {
          columns: [
            table3,
            table4,
          ],
        },

        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: `\nTiros`,
                  alignment: 'center',
                  style: 'header',
                  border: [false, false, false, false],
                  bold: true
                }
              ]
            ]
          }
        },
        {
          columns: [
            table5,
            table6,
          ],
        },

        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: `\nGoles`,
                  alignment: 'center',
                  style: 'header',
                  border: [false, false, false, false],
                  bold: true
                }
              ]
            ]
          }
        },
        {
          columns: [
            table7,
            table8,
          ],
        },

        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: `\nSustitutos`,
                  alignment: 'center',
                  style: 'header',
                  border: [false, false, false, false],
                  bold: true
                }
              ]
            ]
          }
        },
        {
          columns: [
            table9,
            table10,
          ],
        },

        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: `\nPases`,
                  alignment: 'center',
                  style: 'header',
                  border: [false, false, false, false],
                  bold: true
                }
              ]
            ]
          }
        },
        {
          columns: [
            table11,
            table12,
          ],
        },

        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: `Entradas`,
                  alignment: 'center',
                  style: 'header',
                  border: [false, false, false, false],
                  bold: true
                }
              ]
            ]
          }
        },
        {
          columns: [
            table13,
            table14,
          ],
        },

        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: `\nRegates`,
                  alignment: 'center',
                  style: 'header',
                  border: [false, false, false, false],
                  bold: true
                }
              ]
            ]
          }
        },
        {
          columns: [
            table15,
            table16,
          ],
        },

        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: `\nDuelos`,
                  alignment: 'center',
                  style: 'header',
                  border: [false, false, false, false],
                  bold: true
                }
              ]
            ]
          }
        },
        {
          columns: [
            table17,
            table18,
          ],
        },

        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: `\nFaltas`,
                  alignment: 'center',
                  style: 'header',
                  border: [false, false, false, false],
                  bold: true
                }
              ]
            ]
          }
        },
        {
          columns: [
            table19,
            table20,
          ],
        },

        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: `\nTarjetas`,
                  alignment: 'center',
                  style: 'header',
                  border: [false, false, false, false],
                  bold: true
                }
              ]
            ]
          }
        },
        {
          columns: [
            table21,
            table22,
          ],
        },

        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: `\nPenaltis`,
                  alignment: 'center',
                  style: 'header',
                  border: [false, false, false, false],
                  bold: true
                }
              ]
            ]
          }
        },
        {
          columns: [
            table23,
            table24,
          ],
        },
      ],

      styles: {
        header: {
          fontSize: 20,
          bold: true,
        },
        subheader: {
          fontSize: 9,
          bold: true,
        },
        quote: {
          italics: true
        },
        small: {
          fontSize: 8
        },
        tableExample: {
          margin: 3,
          fontSize: 9,
        }
      }
    }

    this.pdfObj = pdfMake.createPdf(docDef)
    // .download(`${this.players1.map(e => e.name)[0]} vs ${this.players2.map(e => e.name)[0]}`);
    console.log(this.pdfObj);

    try {
      if (this.platform.is('mobile')) {
        this.pdfObj.getBuffer((buffer: any) => {
          var blob = new Blob([buffer], { type: 'application/pdf' });

          File.writeFile(File.dataDirectory, `${this.players1.map(e => e.name)[0]} vs ${this.players2.map(e => e.name)[0]}`, blob, { replace: true })
            .then((fileEntry: any) => {
              FileOpener.open(File.dataDirectory + `${this.players1.map(e => e.name)[0]} vs ${this.players2.map(e => e.name)[0]}`, 'application/pdf')
            })
            .catch((error: any) => {
              alertModal({
                title: 'Error de Descarga del PDF',
                text: 'Se ha producido un error al intentar descargar el PDF. Por favor, verifica tu conexión a internet y vuelve a intentarlo.',
                button: [
                  {
                    cssClass: 'alert-button-cancel',
                    text: 'Cerrar',
                  }
                ],
                alertController: this.alertController
              })
            });
        });
      } else {
        this.pdfObj.download(`${this.players1.map(e => e.name)[0]} vs ${this.players2.map(e => e.name)[0]}`);
      }
    } catch (error) {
      alertModal({
        title: 'Error de Descarga del PDF',
        text: 'Se ha producido un error al intentar descargar el PDF. Por favor, verifica tu conexión a internet y vuelve a intentarlo.',
        button: [
          {
            cssClass: 'alert-button-cancel',
            text: 'Cerrar',
          }
        ],
        alertController: this.alertController
      })
    }
  }

  ngOnInit() {
    this.footballTeams1();
    this.footballTeams2();
  }

  chart(type: any) {
    if (this.chart1 && this.chart2 === undefined) {
      this.chart1.destroy();
      this.generateChartPlayer1(type)
    } else if (this.chart2 && this.chart1 === undefined) {
      this.chart2.destroy();
      this.generateChartPlayer2(type)
    } else {
      this.chart1.destroy();
      this.chart2.destroy();

      this.generateChartPlayer1(type)
      this.generateChartPlayer2(type)
    }
  }

  // pieChart() {
  //   if (this.chart1 && this.chart2 === undefined) {
  //     this.chart1.destroy();
  //     this.generateChartPlayer1('pie')
  //   } else if (this.chart2 && this.chart1 === undefined) {
  //     this.chart2.destroy();
  //     this.generateChartPlayer2('pie')
  //   } else {
  //     this.chart1.destroy();
  //     this.chart2.destroy();

  //     this.generateChartPlayer1('pie')
  //     this.generateChartPlayer2('pie')
  //   }
  // }

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

  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ChatBotPage,
      componentProps: {
        statistic1: this.players1,
        statistic2: this.players2,
      }
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role) {
    }
  }

  setLandscape() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE)
    this.band = true
  }

  setPortrait() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT)
    this.band = false
  }

  generateChartPlayer1(type: any) {
    if (this.chart1) {
      this.chart1.destroy();
    }

    const ctx = this.chartCanvas1.nativeElement.getContext('2d')

    this.dataChart = []

    this.dataChart = [
      this.players1.map(e => e.shot.total === null ? 3 : e.shot.total)[0],
      this.players1.map(e => e.goal.total === null ? 1 : e.goal.total)[0],
      this.players1.map(e => e.passe.total === null ? 5 : e.passe.total)[0],
      this.players1.map(e => e.tackle.total === null ? 4 : e.tackle.total)[0],
      this.players1.map(e => e.dribble.success === null ? 2 : e.dribble.success)[0]
    ]

    console.log(this.dataChart)

    this.chart1 = new Chart(ctx, {
      type: type,
      data: {
        labels: ['Tiros', 'Goles', 'Pases', 'Entradas', 'Regates'],
        datasets: [
          {
            label: this.players1.map(e => e.name)[0],
            data: this.dataChart,
            ...type !== 'pie' && { borderColor: '#C69310' },
            ...type !== 'pie' && { backgroundColor: '#C69310' },
            borderWidth: 1
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "white",
              font: {
                size: 15,
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
                size: 15,
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
                size: 15,
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

  generateChartPlayer2(type: any) {
    if (this.chart2) {
      this.chart2.destroy();
    }

    const ctx = this.chartCanvas2.nativeElement.getContext('2d')

    this.dataChart2 = []

    this.dataChart2 = [
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
        datasets: [
          {
            label: this.players1.map(e => e.name)[0],
            data: this.dataChart,
            ...type !== 'pie' && { borderColor: '#C69310' },
            ...type !== 'pie' && { backgroundColor: '#C69310' },
            // borderWidth: 1
          },
          {
            label: this.players2.map(e => e.name)[0],
            data: this.dataChart2,
            ...type !== 'pie' && { borderColor: '#5e2129' },
            ...type !== 'pie' && { backgroundColor: '#5e2129' },
            // borderWidth: 1
          },
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "white",
              font: {
                size: 15,
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
                size: 15,
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
                size: 15,
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

  footballTeams1() {
    this.authService.call(null, 'getAllTeams', 'GET', true).subscribe({
      next: (response) => {
        if (response.status === Constant.SUCCESS) {
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

  footballTeams2() {
    this.authService.call(null, 'getAllTeams', 'GET', true).subscribe({
      next: (response) => {
        if (response.status === Constant.SUCCESS) {
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

  async squad1(teamID: any) {
    await loadingSpinner(this.loadingCtrl)

    this.authService.call(null, `getSquad/${teamID}`, 'GET', true).subscribe({
      next: (response) => {
        if (response.status === Constant.SUCCESS) {
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

  async squad2(teamID: any) {
    await loadingSpinner(this.loadingCtrl)

    this.authService.call(null, `getSquad/${teamID}`, 'GET', true).subscribe({
      next: (response) => {
        if (response.status === Constant.SUCCESS) {
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

  async player1(playerId: any) {
    await loadingSpinner(this.loadingCtrl);

    this.authService.call(null, `getPlayer/${playerId}`, 'GET', true).subscribe({
      next: (response) => {
        console.log(response)
        if (response.status === Constant.SUCCESS) {
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
              penalty: { won: any, committed: any, scored: any, missed: any, saved: any };
              market_value: { market_value: any, date: any, market_value_currency: any }
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
              },
              market_value: {
                market_value: response.data.market_value === undefined ? 0 : response.data.market_value.market_value,
                date: response.data.market_value === undefined ? 0 : this.datePipe.transform(response.data.market_value.date, 'dd/MM/yyyy', '+0000', 'en-US'),
                market_value_currency: response.data.market_value === undefined ? '€' : response.data.market_value.market_value_currency
              },
            })
          },
          )

          this.loadingCtrl.dismiss()
          this.ref.detectChanges()
          if (this.players2.length === 0) {
            this.generateChartPlayer1('bar')
          } else {
            this.generateChartPlayer2('bar')
          }
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
  }

  async player2(playerId: any) {
    await loadingSpinner(this.loadingCtrl);

    this.authService.call(null, `getPlayer/${playerId}`, 'GET', true).subscribe({
      next: (response) => {
        console.log(response)
        if (response.status === Constant.SUCCESS) {
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
              penalty: { won: any, committed: any, scored: any, missed: any, saved: any };
              market_value: { market_value: any, date: any, market_value_currency: any }
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
              },
              market_value: {
                market_value: response.data.market_value === undefined ? 0 : response.data.market_value.market_value,
                date: response.data.market_value === undefined ? 0 : this.datePipe.transform(response.data.market_value.date, 'dd/MM/yyyy', '+0000', 'en-US'),
                market_value_currency: response.data.market_value === undefined ? '€' : response.data.market_value.market_value_currency
              },
            })
          })
          this.loadingCtrl.dismiss()
          this.ref.detectChanges()
          this.generateChartPlayer2('bar')
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
  }

}

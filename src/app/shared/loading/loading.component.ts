import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}

export async function loadingSpinner(loadingCtrl: LoadingController) {
  const loading = await loadingCtrl.create({
    // message: 'Cargando...',
    spinner: 'crescent',
  });

  return await loading.present()
}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayerDetailsPageRoutingModule } from './player-details-routing.module';

import { PlayerDetailsPage } from './player-details.page';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { MaskitoModule } from '@maskito/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayerDetailsPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    HttpClientModule,
    MaskitoModule
  ],
  declarations: [PlayerDetailsPage]
})
export class PlayerDetailsPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TablePlayersPageRoutingModule } from './table-players-routing.module';

import { TablePlayersPage } from './table-players.page';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TablePlayersPageRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    HttpClientModule,
  ],
  declarations: [TablePlayersPage]
})
export class TablePlayersPageModule { }

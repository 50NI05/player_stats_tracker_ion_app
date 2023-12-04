import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeamDetailsPageRoutingModule } from './team-details-routing.module';

import { TeamDetailsPage } from './team-details.page';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeamDetailsPageRoutingModule,
    TranslateModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  declarations: [TeamDetailsPage]
})
export class TeamDetailsPageModule { }

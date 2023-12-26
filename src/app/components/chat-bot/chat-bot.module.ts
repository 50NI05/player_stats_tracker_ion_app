import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatBotPageRoutingModule } from './chat-bot-routing.module';

import { ChatBotPage } from './chat-bot.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatBotPageRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  declarations: [ChatBotPage]
})
export class ChatBotPageModule { }

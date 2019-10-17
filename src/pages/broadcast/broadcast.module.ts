import { LimitCharsPipeModule } from './../../pipes/limit-chars/LimitCharsPipeModule';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BroadcastPage } from './broadcast';
import { GomoHeaderModule } from '../../components/gomo-header/gomoheadermodule';
import { PickerModule } from '@ctrl/ngx-emoji-mart';

@NgModule({
  declarations: [
    BroadcastPage,
  ],
  imports: [
    IonicPageModule.forChild(BroadcastPage),GomoHeaderModule,PickerModule,LimitCharsPipeModule
  ],
})
export class BroadcastPageModule {}

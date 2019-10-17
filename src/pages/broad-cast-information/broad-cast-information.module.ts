import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BroadCastInformationPage } from './broad-cast-information';
import { MediaPipeModule } from '../../pipes/mediapipe/MediaPipeModule';

@NgModule({
  declarations: [
    BroadCastInformationPage,
  ],
  imports: [
    IonicPageModule.forChild(BroadCastInformationPage),MediaPipeModule
  ],
})
export class BroadCastInformationPageModule {}

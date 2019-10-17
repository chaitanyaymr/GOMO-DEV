import { Dialogs } from '@ionic-native/dialogs';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TagmodalPage } from './tagmodal';

@NgModule({
  declarations: [
    TagmodalPage,
  ],
  imports: [
    IonicPageModule.forChild(TagmodalPage),
  ],
  providers:[ Dialogs]
})
export class TagmodalPageModule {}

import { MediaPipeModule } from './../../pipes/mediapipe/MediaPipeModule';
import { FilePath } from '@ionic-native/file-path';
import { LimitCharsPipeModule } from './../../pipes/limit-chars/LimitCharsPipeModule';

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessengeraboutPage } from './messengerabout';
import { Camera } from '@ionic-native/camera';
import{File} from '@ionic-native/file';
import { GomoHeaderModule } from '../../components/gomo-header/gomoheadermodule';

@NgModule({
  declarations: [
    MessengeraboutPage,
  ],
  imports: [
    IonicPageModule.forChild(MessengeraboutPage),LimitCharsPipeModule,GomoHeaderModule,MediaPipeModule
  ],
  providers:[Camera,File,FilePath]
})
export class MessengeraboutPageModule {}

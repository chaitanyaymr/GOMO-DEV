import { Camera } from '@ionic-native/camera';

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConversationsPage } from './conversations';
import { UtcConvertPipeModule } from '../../pipes/utc-convert/utcconvertpipemodule';
import { DateProcessPipeModule } from '../../pipes/dateprocess/dateprocesspipemodule';
import { PickerModule } from '@ctrl/ngx-emoji-mart'
import { LimitCharsPipeModule } from '../../pipes/limit-chars/LimitCharsPipeModule';
import {FileChooser} from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { Base64 } from '@ionic-native/base64';
import { Transfer } from '@ionic-native/transfer';
import {File} from '@ionic-native/file';

@NgModule({
  declarations: [
    ConversationsPage,
  ],
  imports: [
    IonicPageModule.forChild(ConversationsPage),
    
    UtcConvertPipeModule,
    DateProcessPipeModule,
    PickerModule,
    LimitCharsPipeModule,
   
  ],
  providers:[FileChooser,FilePath,Base64,Transfer,File,Camera

  ]
})
export class ConversationsPageModule {}

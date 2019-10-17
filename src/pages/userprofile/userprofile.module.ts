import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserprofilePage } from './userprofile';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { TextMaskModule } from 'angular2-text-mask';      
@NgModule({
  declarations: [
    UserprofilePage,
  ],
  imports: [
    IonicPageModule.forChild(UserprofilePage),TextMaskModule
  ],
  providers:[Camera,File,FilePath ]
})
export class UserprofilePageModule {}

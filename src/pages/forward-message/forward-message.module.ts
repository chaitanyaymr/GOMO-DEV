import { Camera } from '@ionic-native/camera';
import { SearchDataByTermPipeModule } from './../../pipes/search-data-by-term/searchDataByTermPipeModule';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForwardMessagePage } from './forward-message';
import { SearchFilterPipeModule } from '../../pipes/searchfilter/searchfilter.module';

@NgModule({
  declarations: [
    ForwardMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(ForwardMessagePage),SearchDataByTermPipeModule,SearchFilterPipeModule
  ],
  providers:[Camera]
})
export class ForwardMessagePageModule {}

import { GomoFooterModule } from './../../components/gomofooter/gomofootermodule';
import { NgModule } from '@angular/core';
import { IonicPageModule} from 'ionic-angular';
import { HomePage } from './home';
import { GomoHeaderModule } from '../../components/gomo-header/gomoheadermodule';
import { DateProcessPipeModule } from '../../pipes/dateprocess/dateprocesspipemodule';
import {SearchFilterPipeModule}  from '../../pipes/searchfilter/searchfilter.module'
import { HomedtfilterPipeModule } from '../../pipes/homedtfilter/hmdtfiletr.modules';
import { LimitCharsPipeModule } from '../../pipes/limit-chars/LimitCharsPipeModule';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),GomoHeaderModule,GomoFooterModule,DateProcessPipeModule,
    SearchFilterPipeModule,HomedtfilterPipeModule,LimitCharsPipeModule

  ],
  providers: [
   
  ]
})
export class HomePageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewConversationsPage } from './new-conversations';
import { GomoHeaderModule } from '../../components/gomo-header/gomoheadermodule';
import { GomoFooterModule } from '../../components/gomofooter/gomofootermodule';
import { DateProcessPipeModule } from '../../pipes/dateprocess/dateprocesspipemodule';
import { SearchFilterPipeModule } from '../../pipes/searchfilter/searchfilter.module';
import { HomedtfilterPipeModule } from '../../pipes/homedtfilter/hmdtfiletr.modules';
import { LimitCharsPipeModule } from '../../pipes/limit-chars/LimitCharsPipeModule';

@NgModule({
  declarations: [
    NewConversationsPage,
  ],
  imports: [
    IonicPageModule.forChild(NewConversationsPage),
    GomoHeaderModule,GomoFooterModule,DateProcessPipeModule,
    SearchFilterPipeModule,HomedtfilterPipeModule,LimitCharsPipeModule
  ],
})
export class NewConversationsPageModule {}

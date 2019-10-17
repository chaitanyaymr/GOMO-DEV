import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParticipantsPage } from './participants';
import { searchParticipantsPipeModule } from '../../pipes/search-participants/searchParticipantsPipeModule';

@NgModule({
  declarations: [
    ParticipantsPage,
  ],
  imports: [
    IonicPageModule.forChild(ParticipantsPage),searchParticipantsPipeModule
  ],
})
export class ParticipantsPageModule {}

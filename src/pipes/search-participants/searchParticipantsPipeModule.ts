//searchParticipantsPipeModule


import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SearchParticipantsPipe } from './search-participants';






@NgModule({
	declarations: [SearchParticipantsPipe],
	imports: [IonicModule],
	exports: [SearchParticipantsPipe],
	providers:[]
})
export class searchParticipantsPipeModule {}
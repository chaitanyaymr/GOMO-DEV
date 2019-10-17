//
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SearchForAccordionPipe } from './search-for-accordion';





@NgModule({
	declarations: [SearchForAccordionPipe],
	imports: [IonicModule],
	exports: [SearchForAccordionPipe],
	providers:[]
})
export class SearchforAccordionPipeModule {}
//searchDataByTermPipeModule

import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SearchDataByTermPipe } from './search-data-by-term';





@NgModule({
	declarations: [SearchDataByTermPipe],
	imports: [IonicModule],
	exports: [SearchDataByTermPipe],
	providers:[]
})
export class SearchDataByTermPipeModule {}
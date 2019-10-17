import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';
import { SearchfilterPipe } from './searchfilter';




@NgModule({
	declarations: [SearchfilterPipe],
	imports: [IonicModule],
	exports: [SearchfilterPipe],
	providers:[]
})
export class SearchFilterPipeModule {}
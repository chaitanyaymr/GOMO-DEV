import { LimitCharsPipe } from './limit-chars';
//LimitCharsPipeModule


import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';






@NgModule({
	declarations: [LimitCharsPipe],
	imports: [IonicModule],
	exports: [LimitCharsPipe],
	providers:[]
})
export class LimitCharsPipeModule {}
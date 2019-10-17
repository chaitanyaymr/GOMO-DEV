import { NgModule } from '@angular/core';

import { IonicModule } from 'ionic-angular';
import { UtcConvertPipe } from './utc-convert';




@NgModule({
	declarations: [UtcConvertPipe],
	imports: [IonicModule],
	exports: [UtcConvertPipe],
	providers:[]
})
export class UtcConvertPipeModule {}
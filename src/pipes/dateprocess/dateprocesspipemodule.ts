import { DateprocessPipe } from './dateprocess';
//dateprocesspipemodule
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';





@NgModule({
	declarations: [DateprocessPipe],
	imports: [IonicModule],
	exports: [DateprocessPipe],
	providers:[]
})
export class DateProcessPipeModule {}
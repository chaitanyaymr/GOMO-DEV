
import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MediapipePipe } from './mediapipe';





@NgModule({
	declarations: [MediapipePipe],
	imports: [IonicModule],
	exports: [MediapipePipe],
	providers:[]
})
export class MediaPipeModule {}
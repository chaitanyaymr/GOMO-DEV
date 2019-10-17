import { NgModule, Injectable } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { GomoHeaderComponent } from './gomo-header';

@NgModule({
	declarations: [GomoHeaderComponent],
	imports: [IonicModule],
	exports: [GomoHeaderComponent],
	providers:[]
})
export class GomoHeaderModule {}
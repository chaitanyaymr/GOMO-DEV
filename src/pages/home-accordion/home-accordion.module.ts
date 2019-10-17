import { LimitCharsPipeModule } from './../../pipes/limit-chars/LimitCharsPipeModule';
import { SearchforAccordionPipeModule } from './../../pipes/search-for-accordion/SearchforAccordionPipeModule';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeAccordionPage } from './home-accordion';

@NgModule({
  declarations: [
    HomeAccordionPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeAccordionPage),SearchforAccordionPipeModule,LimitCharsPipeModule
  ],
})
export class HomeAccordionPageModule {}

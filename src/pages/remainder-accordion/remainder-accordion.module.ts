import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RemainderAccordionPage } from './remainder-accordion';
import { SearchforAccordionPipeModule } from '../../pipes/search-for-accordion/SearchforAccordionPipeModule';
import { LimitCharsPipeModule } from '../../pipes/limit-chars/LimitCharsPipeModule';

@NgModule({
  declarations: [
    RemainderAccordionPage,
  ],
  imports: [
    IonicPageModule.forChild(RemainderAccordionPage),SearchforAccordionPipeModule,LimitCharsPipeModule
  ],
})
export class RemainderAccordionPageModule {}

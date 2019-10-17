import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DocsAccordionPage } from './docs-accordion';
import { SearchforAccordionPipeModule } from '../../pipes/search-for-accordion/SearchforAccordionPipeModule';
import { LimitCharsPipeModule } from '../../pipes/limit-chars/LimitCharsPipeModule';

@NgModule({
  declarations: [
    DocsAccordionPage,
  ],
  imports: [
    IonicPageModule.forChild(DocsAccordionPage),SearchforAccordionPipeModule,LimitCharsPipeModule
  ],
})
export class DocsAccordionPageModule {}

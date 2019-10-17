import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DocsDetailsPopUpPage } from './docs-details-pop-up';

@NgModule({
  declarations: [
    DocsDetailsPopUpPage,
  ],
  imports: [
    IonicPageModule.forChild(DocsDetailsPopUpPage),
  ],
})
export class DocsDetailsPopUpPageModule {}

import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MidtransPage} from './midtrans';


@NgModule({
  declarations: [MidtransPage],
  imports: [
  	IonicPageModule.forChild(MidtransPage)
  ],
  entryComponents: [
  	MidtransPage
  ]
})
export class MidtransPageModule { }
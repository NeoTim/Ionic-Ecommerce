import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {TabFilterPage} from './tab-filter';


@NgModule({
  declarations: [TabFilterPage],
  imports: [
  	IonicPageModule.forChild(TabFilterPage)
  ],
  entryComponents: [
  	TabFilterPage
  ]
})
export class TabFilterPageModule { }
import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {OrderReceivedPage} from './order-received';
import {OrderService} from "../../services/order-service";

@NgModule({
  declarations: [OrderReceivedPage],
  imports: [
  	IonicPageModule.forChild(OrderReceivedPage)
  ],
  entryComponents: [
  	OrderReceivedPage
  ],
  providers: [
  	OrderService
  ]
})
export class OrderReceivedPageModule { }
import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {MyOrderPage} from './my-order';
import {OrderService} from "../../services/order-service";

@NgModule({
  declarations: [MyOrderPage],
  imports: [
  	IonicPageModule.forChild(MyOrderPage)
  ],
  entryComponents: [
  	MyOrderPage
  ],
  providers: [
  	OrderService
  ]
})
export class MyOrderPageModule { }
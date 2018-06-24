import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {OrderDetailsPage} from './order-details';
import {OrderService} from "../../services/order-service";

@NgModule({
  declarations: [OrderDetailsPage],
  imports: [
  	IonicPageModule.forChild(OrderDetailsPage)
  ],
  entryComponents: [
  	OrderDetailsPage
  ],
  providers: [
  	OrderService
  ]
})
export class OrderDetailsPageModule { }
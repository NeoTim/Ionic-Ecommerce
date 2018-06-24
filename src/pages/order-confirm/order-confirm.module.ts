import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {OrderConfirmPage} from './order-confirm';
import {CartService} from '../../services/cart-service';
import {UserService} from '../../services/user-service';

@NgModule({
  declarations: [OrderConfirmPage],
  imports: [
  	IonicPageModule.forChild(OrderConfirmPage)
  ],
  entryComponents: [
  	OrderConfirmPage
  ],
  providers: [
    CartService,
  	UserService
  ]
})
export class OrderConfirmPageModule { }
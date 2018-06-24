import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CartPage} from './cart';
import {CartService} from '../../services/cart-service';
import {ItemService} from '../../services/item-service';
import {UserService} from '../../services/user-service';

@NgModule({
  declarations: [CartPage],
  imports: [
  	IonicPageModule.forChild(CartPage)
  ],
  entryComponents: [
  	CartPage
  ],
  providers: [
  	CartService,
    ItemService,
    UserService
  ]
})
export class CartPageModule { }
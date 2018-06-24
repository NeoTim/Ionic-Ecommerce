import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {PaymentMethodPage} from './payment-method';
import {UserService} from '../../services/user-service';
import {MidtransService} from '../../services/midtrans-service';


@NgModule({
  declarations: [PaymentMethodPage],
  imports: [
  	IonicPageModule.forChild(PaymentMethodPage)
  ],
  entryComponents: [
  	PaymentMethodPage
  ],
  providers: [
  	UserService,
    MidtransService
  ]
})
export class PaymentMethodPageModule { }
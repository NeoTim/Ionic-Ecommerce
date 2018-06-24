import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ModalAddressOptionPage} from './modal-address-option';
import {UserService} from '../../services/user-service';

@NgModule({
  declarations: [ModalAddressOptionPage],
  imports: [
  	IonicPageModule.forChild(ModalAddressOptionPage)
  ],
  entryComponents: [
  	ModalAddressOptionPage
  ],
  providers: [
  	UserService
  ]
})
export class ModalAddressOptionPageModule { }
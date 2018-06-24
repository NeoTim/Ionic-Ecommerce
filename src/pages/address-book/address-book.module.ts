import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {AddressBookPage} from './address-book';
import {UserService} from '../../services/user-service';

@NgModule({
  declarations: [AddressBookPage],
  imports: [
  	IonicPageModule.forChild(AddressBookPage)
  ],
  entryComponents: [
  	AddressBookPage
  ],
  providers: [
  	UserService
  ]
})
export class AddressBookPageModule { }
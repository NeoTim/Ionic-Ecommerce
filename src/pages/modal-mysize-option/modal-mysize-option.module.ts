import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ModalMySizeOptionPage} from './modal-mysize-option';
import {ItemService} from '../../services/item-service';
import {UserService} from '../../services/user-service';

@NgModule({
  declarations: [ModalMySizeOptionPage],
  imports: [
  	IonicPageModule.forChild(ModalMySizeOptionPage)
  ],
  entryComponents: [
  	ModalMySizeOptionPage
  ],
  providers: [
  	ItemService,
  	UserService
  ]
})
export class ModalMySizeOptionPageModule { }
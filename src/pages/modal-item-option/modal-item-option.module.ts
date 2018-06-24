import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ModalItemOptionPage} from './modal-item-option';
import {ItemService} from '../../services/item-service';
import {UserService} from '../../services/user-service';

@NgModule({
  declarations: [ModalItemOptionPage],
  imports: [
  	IonicPageModule.forChild(ModalItemOptionPage)
  ],
  entryComponents: [
  	ModalItemOptionPage
  ],
  providers: [
  	ItemService,
  	UserService
  ]
})
export class ModalItemOptionPageModule { }
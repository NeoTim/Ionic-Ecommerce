import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ItemPage} from './item';
import {ItemService} from '../../services/item-service';
import {UserService} from '../../services/user-service';

@NgModule({
  declarations: [ItemPage],
  imports: [
  	IonicPageModule.forChild(ItemPage)
  ],
  entryComponents: [
  	ItemPage
  ],
  providers: [
  	ItemService,
    UserService
  ]
})
export class ItemPageModule { }
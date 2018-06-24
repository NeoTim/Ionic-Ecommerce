import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HomePage} from './home';
import {CategoryService} from '../../services/category-service';
import {ItemService} from '../../services/item-service';

@NgModule({
  declarations: [HomePage],
  imports: [
  	IonicPageModule.forChild(HomePage)
  ],
  entryComponents: [
  	HomePage
  ],
  providers: [
  	CategoryService,
  	ItemService
  ]
})
export class HomePageModule { }
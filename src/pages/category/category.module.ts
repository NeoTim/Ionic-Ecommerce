import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CategoryPage} from './category';
import {CategoryService} from '../../services/category-service';
import {ItemService} from '../../services/item-service';


@NgModule({
  declarations: [CategoryPage],
  imports: [
  	IonicPageModule.forChild(CategoryPage)
  ],
  entryComponents: [
  	CategoryPage
  ],
  providers: [
  	CategoryService,
  	ItemService
  ]
})
export class CategoryPageModule { }
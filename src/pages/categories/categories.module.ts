import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CategoriesPage} from './categories';
import {CategoryService} from '../../services/category-service';

@NgModule({
  declarations: [CategoriesPage],
  imports: [
  	IonicPageModule.forChild(CategoriesPage)
  ],
  entryComponents: [
  	CategoriesPage
  ],
  providers: [
  	CategoryService
  ]
})
export class CategoriesPageModule { }
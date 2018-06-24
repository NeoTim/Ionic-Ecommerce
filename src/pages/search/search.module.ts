import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {SearchPage} from './search';

import {CategoryService} from '../../services/category-service';


@NgModule({
  declarations: [SearchPage],
  imports: [
  	IonicPageModule.forChild(SearchPage)
  ],
  entryComponents: [
  	SearchPage
  ],
  providers: [
  	CategoryService
  ]
})
export class SearchPageModule { }
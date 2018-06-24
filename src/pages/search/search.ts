import {Component} from '@angular/core';
import {NavController, IonicPage} from 'ionic-angular';

import {CategoryService} from '../../services/category-service';

@IonicPage({name: 'search'}) 
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  public search: any;
  constructor(public nav: NavController, public categoryService: CategoryService) {
  }

  onSearch(event) {
  	const value = event.target.value;
  	this.categoryService.search(value).then(data => {
	  this.search = data;
  	});
  }

  viewResults(type, value) {
  	this.nav.push('category', {searchType: type, searchData: value, name: 'Search Results For: ' + value});
  }
}

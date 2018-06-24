import {Component} from '@angular/core';
import {NavController, LoadingController, IonicPage} from 'ionic-angular';
import {CategoryService} from '../../services/category-service';

/*
 Generated class for the CategoriesPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@IonicPage({name: 'categories-list'}) 
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html'
})
export class CategoriesPage {
  // list of categories
  public categories: any;
  private loading: any;
  public showLevel: Object = {};

  constructor(public nav: NavController, public categoryService: CategoryService, public loadingCtrl: LoadingController) {
  }

  // view category
  viewCategory(categoryId, categoryName) {
    this.nav.push('category', {id: categoryId, name: categoryName});
  }

  toggleLevel(event: Event, idx: string) {
    if (this.isLevelShown(idx)) {
      this.showLevel[idx] = null;
    } else {
      this.showLevel[idx] = idx;
    }
    event.stopPropagation();
  }

  isLevelShown(idx: string) {
    return this.showLevel[idx] === idx;
  }

  ionViewDidLoad() {
  	this.loading = this.loadingCtrl.create();
    this.loading.present();
    
    this.categoryService.getA().then(data => {
    	this.loading.dismiss().then( () => {
    		this.categories = data.children_data;
    	});
    });
  }

  // view cart
  goToCart() {
    this.nav.setRoot('carts');
  }
}

import {Component} from '@angular/core';
import {NavController, IonicPage} from 'ionic-angular';
import {CategoryService} from '../../services/category-service';
import {ItemService} from '../../services/item-service';
import {ENV} from '@environment';

@IonicPage({name: 'welcome'})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  // list slides for slider
  public slides = [
    {
      src: 'assets/img/slide_1.jpg'
    },
    {
      src: 'assets/img/slide_2.jpg'
    },
    {
      src: 'assets/img/slide_3.jpg'
    }
  ];

  // list of items
  public items: any;
  private imgBasePath: any;
  private imgProductBasePath: any;
  public deals: any;
  private currencySym: any;

  constructor(public nav: NavController, public categoryService: CategoryService, public itemService: ItemService) {
    this.items = itemService.getAll();
    this.imgBasePath = ENV.IMAGE_ENDPOINT;
    this.imgProductBasePath = ENV.PRODUCT_IMAGE_ENDPOINT;
    this.currencySym = ENV.CURRENCY_SYMBOL;
  }

  ionViewDidLoad() {
    //this.loading = this.loadingCtrl.create();
    //this.loading.present();
    
    this.itemService.getDealsProducts().then(data => {
      //this.loading.dismiss().then( () => {
        this.deals = data;
      //});
    });
  }

  // get discount percent
  discountPercent(originPrice, salePrice) {
    return Math.round((salePrice - originPrice) * 100 / originPrice)
  }

  viewCategory(categoryId, categoryName) {
    this.nav.push('category', {id: categoryId, name: categoryName});
  }

  // view categories
  viewCategories() {
    this.nav.push('categories-list');
  }

  // view a item
  viewItem(product_sku, product_name) {
    this.nav.push('items', {product_sku: product_sku, product_name: product_name})
  }

  // go to search page
  goToSearch() {
    this.nav.push('search');
  }

  // view cart
  goToCart() {
    this.nav.setRoot('carts');
  }
}

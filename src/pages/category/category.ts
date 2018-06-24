import {Component} from '@angular/core';
import {NavController, ActionSheetController, ModalController, NavParams, LoadingController, IonicPage} from 'ionic-angular';

import {ItemService} from '../../services/item-service';
import {CategoryService} from '../../services/category-service';
import {ENV} from '@environment';


@IonicPage({name: 'category'})
@Component({
  selector: 'page-category',
  templateUrl: 'category.html'
})
export class CategoryPage {
  // list items of this category
  public items: any;
  private loading: any;

  // category info
  public category: any;
  public catId: any;
  public searchType: any;
  public searchData: any;
  private imgBasePath: any;
  private currencySym: any;

  // view type
  public viewType = 'grid';

  // sort by
  public sortBy = 'Best Match';

  constructor(public nav: NavController, public itemService: ItemService, public categoryService: CategoryService,
              public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    
    // set category name
    this.category = navParams.get('name');
    this.catId = this.navParams.get('id');
    this.searchType = this.navParams.get('searchType');
    this.searchData = this.navParams.get('searchData');
    this.imgBasePath = ENV.PRODUCT_IMAGE_ENDPOINT;
    this.currencySym = ENV.CURRENCY_SYMBOL;
  }

  ionViewDidLoad() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    
    if (this.searchType) {
      this.getSearchDataItems(null, null);
    } else {
      this.getCategoryItems(null, null);
    }
  }

  // switch to list view
  viewList() {
    this.viewType = 'list';
  }

  // swith to grid view
  viewGrid() {
    this.viewType = 'grid';
  }

  // get discount percent
  discountPercent(originPrice, salePrice) {
    return Math.round((salePrice - originPrice) * 100 / originPrice)
  }

  getSearchDataItems(method, value) {
    this.itemService.getBySearchData(this.searchData, method, value).then(data => {
      this.loading.dismiss().then( () => {
        this.items = data;
      });
    });
  }

  getCategoryItems(method, value) {
    this.itemService.getByCategory(this.catId, method, value).then(data => {
      this.loading.dismiss().then( () => {
        this.items = data;
      });
    });
  }

  updateCategory(method, value) {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    if (this.searchType) {
      this.getSearchDataItems(method, value);
    } else {
      this.getCategoryItems(method, value);
    }
  }

  // choose sort by
  chooseSortBy() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Best Match',
          handler: () => {
            let navTransition = actionSheet.dismiss();
            navTransition.then(() => {
              this.updateCategory('sorts', null);
              this.sortBy = 'Best Match';
            });
            return false;
          }
        },
        {
          text: 'Lowest Price First',
          handler: () => {
            let navTransition = actionSheet.dismiss();
            navTransition.then(() => {
              this.updateCategory('sorts','ASC');
              this.sortBy = 'Lowest Price First';
            });
            return false;
          }
        },
        {
          text: 'Highest Price First',
          handler: () => {
            let navTransition = actionSheet.dismiss();
            navTransition.then(() => {
              this.updateCategory('sorts','DESC');
              this.sortBy = 'Highest Price First';
            });
            return false;
          }
        }        
      ]
    });
    actionSheet.present();
  }

  // show filter modal
  openFilter(tabName) {
    // show modal
    let modal = this.modalCtrl.create('tab-filter');

    // listen for modal close
    modal.onDidDismiss((confirm, data) => {
      if (confirm) {
        this.updateCategory(data['method'], data['value']);
      } else {
        // do nothing
      }
    });

    modal.present();
  }

  // view a item
  viewItem(product_sku, product_name) {
    this.nav.push('items', {product_sku: product_sku, product_name: product_name})
  }

  // view cart
  goToCart() {
    this.nav.setRoot('carts');
  }
}

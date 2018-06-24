import {Component} from '@angular/core';
import {NavController, Events, LoadingController, IonicPage} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {CartService} from '../../services/cart-service';
import {ItemService} from '../../services/item-service';
import {UserService} from '../../services/user-service';
import {ENV} from '@environment';


@IonicPage({name: 'carts'})
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html'
})
export class CartPage {
  public cartTotal: any;
  public cartItems: any;
  public customerToken: any;
  private itemsLoaded: boolean = true;
  private isCartItemsEmpty: any;
  private cartUpdated: any;
  private totalsLoaded: any
  public noItems: any;
  public loading: any;
  private currencySym: any;

  constructor(public nav: NavController, public cartService: CartService, public storage: Storage, public itemService: ItemService, public events: Events, public loadingCtrl: LoadingController, public userService: UserService) {
    // set cart data
    this.cartTotal = '';
    this.cartItems = [];
    this.isCartItemsEmpty = null;
    this.cartUpdated = {};
    this.currencySym = ENV.CURRENCY_SYMBOL; 
  }

  ionViewCanEnter(): Promise<boolean> {
    return this.storage.get('customer_token').then(value => {
      if(!value) {
        this.customerToken = null;
        return true;
      } else {
        this.customerToken = value;
        return true;
      }
    });
  }

  ionViewDidLoad() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.cartService.getCartItems(this.customerToken).then(data => {
      this.loading.dismiss().then( () => {
        this.cartItems = data;
        this.cartTotal = this.totalsLoaded;
        if(this.cartItems.length === 0) {
          this.noItems = 'No carts are available';
        }
      });
    }, err => {
      this.loading.dismiss().then( () => {
        this.noItems = 'No carts are available';
      });
    });
    this.loadTotals();
  }

  loadTotals() {
    this.cartService.getCartsTotal(this.customerToken).then(data => {
      if(data.base_grand_total > 0) {
        if(!this.itemsLoaded) {
          this.cartTotal = data;
        } else {
          this.totalsLoaded = data; // we have set totals here to load after cartitems once loaded 
        }
        if(Object.keys(this.cartUpdated).length > 0 ) {
          if(this.cartUpdated.delete) {
            this.cartItems.splice(this.cartUpdated.index, 1);
          } else {
            const cart = this.cartItems[this.cartUpdated.index];
            cart.qty = this.cartUpdated.qty;
          }
          this.loading.dismiss().then( () => {
            this.cartUpdated = {};
          });
        }
      }
    }, err => {
      this.cartTotal = '';
    });
  }

  addQty(item, index) {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.cartUpdated = {index: index};
    this.itemService.updateItem(this.customerToken, item, 'add').then(data => {
      if(data) {
        this.events.publish('carts-count');
        this.cartUpdated['qty'] = data.qty;
        this.loadTotals();
      }
    });
  }

  minusQty(item, index) {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.cartUpdated = {index: index};
    if(item.qty > 0) {
      this.itemService.updateItem(this.customerToken, item, 'minus').then(data => {
        if(data) {
          this.events.publish('carts-count');
          this.cartUpdated['qty'] = data.qty;
          this.loadTotals();
        }
      });
    }
  }

  // remove item
  remove(item, itemId, itemIndex) {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.cartUpdated = {index: itemIndex};
    this.cartService.deleteCartItems(itemId, this.customerToken).then(data => {
      if(data) {
        if(this.cartItems.length === 1) {
          this.cartItems.splice(this.cartUpdated.index, 1);
          this.events.publish('carts-count');
          this.loading.dismiss().then( () => {
            this.cartTotal = '';
            this.noItems = 'No carts are available';
          });
        } else {
          this.cartUpdated['delete'] = true;
          this.loadTotals();
        }
      }
    }, error => {
      this.noItems = 'No carts are available';
    });
  }

  viewItem(product_sku, product_name) {
    this.nav.push('items', {product_sku: product_sku, product_name: product_name})
  }

  // place order
  buy() {
    return this.storage.get('customer_token').then(token => {
      this.loading = this.loadingCtrl.create();
      this.loading.present();
      this.userService.callNextPage(token, this.loading, this.nav, 'modal-address-option', 'order-confirm');
    });
  }
}

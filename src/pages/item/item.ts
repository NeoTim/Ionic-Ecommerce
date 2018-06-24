import {Component} from '@angular/core';
import {NavController, ModalController, NavParams, LoadingController, IonicPage} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {ItemService} from '../../services/item-service';
import {UserService} from '../../services/user-service';
import {ENV} from '@environment';


/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@IonicPage({name: 'items'})
@Component({
  selector: 'page-item',
  templateUrl: 'item.html'
})
export class ItemPage {
  // item info
  public item: any;
  private loading: any;
  public product: any;
  private customerToken: any;
  private imgBasePath: any;
  private currencySym: any;

  constructor(public nav: NavController, public itemService: ItemService, public modalCtrl: ModalController, public navParams: NavParams, public loadingCtrl: LoadingController, public userService: UserService, public storage: Storage) {
    this.product = this.navParams.get('product_name');
    this.imgBasePath = ENV.PRODUCT_IMAGE_ENDPOINT;
    this.currencySym = ENV.CURRENCY_SYMBOL;
    this.item = {};
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
    
    this.itemService.getItems(this.navParams.get('product_sku')).then(data => {
      this.loading.dismiss().then( () => {
        this.item = data;
      });
    });
  }

  // add or remove item on wish list
  toggleWishList(item) {
    item.on_wish_list = !item.on_wish_list;
  }

  // get item options group name
  getOptionGroupsName(item) {
    let optionGroups = [];
    for (let i = 0; i < item.options.length; i++) {
      if(item.options[i].is_require === true) {
      	optionGroups.push(item.options[i].title);
      }
    }

    if(item.custom_attributes['custom_product_option_active'] && item.custom_attributes['custom_product_option_active'] > 0) {
      optionGroups.push('My Size');
    }

    return optionGroups.join(',');
  }

  // make array with range is n
  range(n) {
    return new Array(n);
  }

  // open item option modal
  showOptions(item) {
    // show modal
    let modal = this.modalCtrl.create('modal-item-option', {item: item}, {showBackdrop: false, enableBackdropDismiss: false});

    // listen for modal close
    modal.onDidDismiss((confirm, loading) => {
      if (confirm) {
        for (let i = 0; i < this.item.options.length; i++) {
          if (this.item.options[i].currentOption) {
             delete this.item.options[i].currentOption;
          }
        }

        if (loading) {
          this.userService.callNextPage(this.customerToken, loading, this.nav, 'modal-address-option', 'order-confirm');
        }
      } else {
        // do nothing
      }
    });

    modal.present();
  }
}

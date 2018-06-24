import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, ToastController, Events, ModalController, LoadingController, IonicPage} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {ENV} from '@environment';

import {ItemService} from '../../services/item-service';
import {UserService} from '../../services/user-service';

@IonicPage({name: 'modal-item-option'})
@Component({
  selector: 'page-modal-item-option',
  templateUrl: 'modal-item-option.html'
})
export class ModalItemOptionPage {
  // current item
  public item: any;
  public customerToken: any;
  public error: any;
  public imgBasePath: any;
  public loading: any;
  private currencySym: any;

  constructor(public nav: NavController, public itemService: ItemService, public navParams: NavParams,
              public viewCtrl: ViewController, public toastCtrl: ToastController, public storage: Storage, public events: Events, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public userService: UserService) {
    this.item = navParams.get('item');
    this.item.option_price = 0;
    this.item.qty = 1;
    this.imgBasePath = ENV.PRODUCT_IMAGE_ENDPOINT;
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

  addQty(item) {
    item.qty = item.qty + 1;
  }

  minusQty(item) {
    item.qty = item.qty - 1;
    if(item.qty < 1) {
      item.qty = 1;
    }
  }

  // choose a option
  chooseOption(optionGroup, option, index, item) {
    const optionsCount = optionGroup.values.length;
    
    for (let i = 0; i < optionsCount; i++) {
      optionGroup.values[i].active = false;
    }

    option.active = true;
    optionGroup.currentOption = option;

    // recalculate price
    this.calculatePrice();

    if(item.custom_attributes['custom_product_option_active'] && item.custom_attributes['custom_product_option_active'] > 0  && optionGroup.title === 'Size' && optionsCount === (index+1)) {
      let modal = this.modalCtrl.create('modal-mysize-option', {item: item}, {showBackdrop: false, enableBackdropDismiss: false});
      // listen for modal close
      modal.onDidDismiss((confirm, loading) => {
        if (confirm) {
          // apply filter here
          for (let i = 0; i < this.item.options.length; i++) {
            if (this.item.options[i].currentOption) {
               delete this.item.options[i].currentOption;
            }
          }
          if (loading) {
            this.viewCtrl.dismiss(true, loading);
          }
        } else {
          // do nothing
        }
      });

      modal.present();
      return false;
    }
  }

  // calculate item price
  calculatePrice() {
    this.item.option_price = 0;
    this.item.choosed_options = {};
    for (let i = 0; i < this.item.options.length; i++) {
      if (this.item.options[i].currentOption) {
        this.item.option_price += this.item.options[i].currentOption.price;
        this.item.choosed_options[this.item.options[i].option_id] = this.item.options[i].currentOption['option_type_id'] 
      }
    }
  }

  validate(item) {
    for(let i = 0; i < item.options.length; i++) {
      if(item.options[i].is_require && !item.options[i]['currentOption']) {
        this.error = true;
        return false;
      }
    }
    return true;
  }

  // add to card
  addCart(item) {
    if(!this.validate(item)) {
      return false;
    }
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.itemService.addCart(item, this.customerToken).then(data => {
      this.loading.dismiss().then( () => {
        this.events.publish('carts-count');
        let toast = this.toastCtrl.create({
          message: 'Item added to card',
          duration: 500,
          position: 'middle'
        });

        toast.present();
        this.viewCtrl.dismiss(true, null);
      });
    });
  }

  // buy now
  buy(item) {
    if(!this.validate(item)) {
      return false;
    }
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.itemService.addCart(item, this.customerToken).then(data => {
      this.events.publish('carts-count');
      for (let i = 0; i < this.item.options.length; i++) {
        if (this.item.options[i].currentOption) {
           delete this.item.options[i].currentOption;
        }
      }
      this.viewCtrl.dismiss(true, this.loading);
    });
  }

  // close modal
  closeModal() {
    this.viewCtrl.dismiss(false);
  }
}

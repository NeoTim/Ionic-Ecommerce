import {Component} from '@angular/core';
import {NavController, NavParams, ViewController, ToastController, Events, LoadingController, IonicPage} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {ItemService} from '../../services/item-service';
import {UserService} from '../../services/user-service';
import {ENV} from '@environment';


/*
 Generated class for the LoginPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@IonicPage({name: 'modal-mysize-option'}) 
@Component({
  selector: 'page-modal-mysize-option',
  templateUrl: 'modal-mysize-option.html'
})
export class ModalMySizeOptionPage {
  // current item
  public item: any;
  public customerToken: any;
  public error: any;
  public termsEnable: boolean = true;
  public checkTerms: boolean = false;
  public loading: any;
  private currencySym: any;

  constructor(public nav: NavController, public itemService: ItemService, public navParams: NavParams,
              public viewCtrl: ViewController, public toastCtrl: ToastController, public storage: Storage, public events: Events, public loadingCtrl: LoadingController, public userService: UserService) {
    this.item = navParams.get('item');
    this.item.option_price = 0;
    this.item.qty = 1;
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

  // choose a option
  chooseOption(optionGroup, option) {
    for (let i = 0; i < optionGroup.values.length; i++) {
      optionGroup.values[i].active = false;
    }

    option.active = true;
    optionGroup.currentOption = option;

    // recalculate price
    this.calculatePrice();
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

  enterSize(event, optionGroup) {
    let status = false;
    if(event.target.value) {
      status = true;
    }
    const option = {
      option_type_id: event.target.value,
      active: status  
    };
    optionGroup.currentOption = option;
  }

  validate(item) {
    for(let i = 0; i < item.options.length; i++) {
      const currentOption = item.options[i]['currentOption'];
      if(!currentOption || (currentOption && !currentOption['active'])) {
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
      this.viewCtrl.dismiss(true, this.loading);
    });
  }

  // close modal
  closeModal() {
    this.viewCtrl.dismiss(false);
  }

  cancelCart() {
    this.viewCtrl.dismiss(false);
  }

  agreeCart() {
    this.termsEnable = false; 
  }

  agreeTerms() {
    if(this.checkTerms) {
      this.checkTerms = false;
    } else {
      this.checkTerms = true;
    }
  }
}

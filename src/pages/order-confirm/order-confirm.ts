import {Component} from '@angular/core';
import {NavController, NavParams, ModalController, Events, LoadingController, IonicPage} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {CartService} from '../../services/cart-service';
import {UserService} from '../../services/user-service';
import {ENV} from '@environment';


@IonicPage({name: 'order-confirm'})
@Component({
  selector: 'page-order-confirm',
  templateUrl: 'order-confirm.html'
})
export class OrderConfirmPage {
  public cart: any;
  public totals: any;
  public customerToken: any;
  public address: any;
  public shippingMethods: any;
  public isShippingMethodUpdated: any;
  public selectedShippingMethod: any;
  public checkoutShipping: any;
  public isAddressUpdated: any;
  public noNewAddress: any;
  public loading: any;
  private currencySym: any;

  constructor(public nav: NavController, public cartService: CartService, public navParams: NavParams, public storage: Storage, public modalCtrl: ModalController, public userService: UserService, public events: Events, public loadingCtrl: LoadingController) {
    this.address = this.navParams.get('address');
    // set cart data
    this.cart = "";
    this.totals = "";
    this.shippingMethods = "";
    this.selectedShippingMethod = "";
    this.isShippingMethodUpdated = true;
    this.isAddressUpdated = true;
    this.currencySym = ENV.CURRENCY_SYMBOL;
    this.checkoutShipping = {
      addressInformation: {}
    };
    events.publish('carts-count');
    events.subscribe('shipping-methods-countryid', (data, action) => {
      if(data) {
        this.shippingMethods = data;
      }
      this.isShippingMethodUpdated = action;
    });
    events.subscribe('add-new-shipping-address', (data) => {
      this.address.noNewAddress = 0;
      data['country_id'] = data['countryId'];
      data['customer_id'] = data['customerId'];
      data['save_in_address_book'] = data['saveInAddressBook'];
      const region = {
        'region_code': data['regionCode'],
        'region_id': data['regionId'],
        'region': data['region']
      };
      data['region'] = region;
      this.address.addresses.push(data);
      this.address.selected = data;
    });
  }

  ionViewCanEnter(): Promise<boolean> {
    return this.storage.get('customer_token').then(value => {
      if(!value) {
        setTimeout(()=>{    
          this.nav.push('login', {goback: 'order-confirm', addAddress: 'modal-address-option'});
        });
        return false;
      } else {
        return true;
      }
    });
  }

  ionViewDidLoad() {
    this.storage.get('customer_token').then(value => {
      if(value) {
        this.customerToken = value;
        if(localStorage.getItem('quoteId')) {
          this.cartService.cartGuestToMine(value).then(data => {
            localStorage.removeItem('quoteId');
          });
        }
        this.isAddressUpdated = false;
        this.getShippingAddress();
      }
    });
  }

  getShippingAddress() {
    this.userService.getShippingMethods(this.address.selected.country_id, this.customerToken).then(data => {
      this.shippingMethods = data;
      this.isShippingMethodUpdated = false;
    })
  }

  changeAddress(item) {
    this.address.selected = item;
    this.isShippingMethodUpdated = true;
    this.userService.getShippingMethods(item.country_id, this.customerToken).then(data => {
      this.shippingMethods = data;
      this.isShippingMethodUpdated = false;
    })
  }

  chooseShippingMethods(item) {
    this.shippingMethods.selected = item; 
  }

  showAddress() {
    // show modal
    const profile = {
      id: this.address.id,
      email: this.address.email,
      firstname: this.address.firstname,
      lastname: this.address.lastname
    };
    let modal = this.modalCtrl.create('modal-address-option', {profile: profile, modal: true, editType: 'editShipping', title : 'Shipping Address'});

    // listen for modal close
    modal.onDidDismiss(confirm => {
      if (confirm) {
        // apply filter here
        console.log('hi');
      } else {
        // do nothing
      }
    });

    modal.present();
  }

  // place order
  buy() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    const shipping = this.shippingMethods.selected;
    const address = this.address.selected;
    const save = this.checkoutShipping.addressInformation;
    save['shippingAddress'] = {};
    save['billingAddress'] = {};
    const data = {
      "region": address.region.region,
      "regionId": address.region.region_id,
      "regionCode": address.region.region_code,
      "countryId": address.country_id,
      "street": address.street,
      "company": address.company,
      "telephone": address.telephone,
      "postcode": address.postcode,
      "city": address.city,
      "firstname": address.firstname,
      "lastname": address.lastname,
      "customerId": address.customer_id,
      "email": this.address.email,
      "save_in_address_book": (address.save_in_address_book ? address.save_in_address_book : 0)
    };
    Object.assign(save['shippingAddress'], data);
    Object.assign(save['billingAddress'], data);
    save['shippingAddress']['sameAsBilling'] = 1;
    if(address.id) {
      save['shippingAddress']['customerAddressId'] = address.id;
      save['billingAddress']['customerAddressId'] = address.id;
    }
    save['shippingMethodCode'] = shipping.method_code;
    save['shippingCarrierCode'] = shipping.carrier_code;
    this.userService.checkoutShipping(this.checkoutShipping, this.customerToken).then(data => {
      this.loading.dismiss().then( () => {
        this.nav.push('payment-method', {billing: save.billingAddress});
      });
    });
  }
}

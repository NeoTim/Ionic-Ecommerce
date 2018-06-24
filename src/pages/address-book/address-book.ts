import {Component} from '@angular/core';
import {NavController, NavParams, ModalController, Events, IonicPage} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {UserService} from '../../services/user-service';

@IonicPage({name: 'address-book'})
@Component({
  selector: 'page-address-book',
  templateUrl: 'address-book.html'
})
export class AddressBookPage {
	
  private profile: any;
  private customerToken: any;

  constructor(public nav: NavController, public userService: UserService, public navParams: NavParams, public storage: Storage, public modalCtrl: ModalController, public events: Events) {
  	this.profile = this.navParams.get('profile');
    events.subscribe('update-address-book', (data) => {
      this.profile = data;
      this.setShippingAddress();
    });
  }

 ionViewCanEnter(): Promise<boolean> {
    return this.storage.get('customer_token').then(value => {
      if(!value) {
       setTimeout(()=>{    
          this.nav.push('login', {goback: 'address-book'});
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
        this.setShippingAddress();
      } else {
        this.customerToken = null;
      }
    });
  }

  setShippingAddress() {
    const addresses = this.profile.addresses;
    const default_shipping = addresses.map(address => {
      return address.default_shipping;
    }).indexOf(true);
    if(default_shipping !== -1) {
      this.profile['defaultShipping'] = this.profile.addresses[default_shipping];
      this.profile['additonal'] = addresses;
      this.profile.additonal.splice(default_shipping, 1);
    }
  }

  updateAddress(data) {
    const title = data ? 'Edit Address' : 'Add New Address'; 
    let modal = this.modalCtrl.create('modal-address-option', {profile: this.profile, modal: true, title: title,  edit_address_data: data, editType: 'AddressBook'});

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
}

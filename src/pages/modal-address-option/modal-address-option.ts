import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NavController, NavParams, LoadingController, AlertController, ViewController, Events, IonicPage} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {UserService} from '../../services/user-service';

@IonicPage({name: 'modal-address-option'})
@Component({
  selector: 'page-modal-address-option',
  templateUrl: 'modal-address-option.html'
})
export class ModalAddressOptionPage {
  authForm: FormGroup;
  private loading: any;
  public countries: any;
  private state: any;
  private isSaveAddress: any;
  private useShipping: boolean = false;
  public profile: any;
  public customerToken: any;
  public isModal: any;
  public country: any;
  public editData: any;
  private editType: any;
  private title: any;

  constructor(public nav: NavController, public formBuilder: FormBuilder, public userService: UserService, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public storage: Storage, public viewCtrl: ViewController, public navParams: NavParams, public events: Events) {
    this.isSaveAddress = 1;
    this.profile = this.navParams.get('profile');
    this.title = this.navParams.get('title');
    this.editData = this.navParams.get('edit_address_data');
    this.isModal = this.navParams.get('modal');
    this.editType = this.navParams.get('editType');
    this.authForm = formBuilder.group({
        firstname: ['', Validators.compose([Validators.required])],
        lastname: ['', Validators.compose([Validators.required])],
        company: [''],
        street: ['', Validators.compose([Validators.required])],
        city: ['', Validators.compose([Validators.required])],
        region: ['', Validators.compose([Validators.required])],
        countryId: ['', Validators.compose([Validators.required])],
        postcode: ['', Validators.compose([Validators.required])],
        telephone: ['', Validators.compose([Validators.required])],
        saveInAddressBook: [true],
        defaultShipping: [false]
    });
    if(this.editData) {
      this.authForm.patchValue(this.editData);
    }
  }

  ionViewCanEnter(): Promise<boolean> {
    return this.storage.get('customer_token').then(value => {
      if(!value) {
        setTimeout(()=>{    
          this.nav.push('login', {goback: 'modal-address-option'});
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
        this.loading = this.loadingCtrl.create();
        this.loading.present();
        this.userService.getCountries().then(data => {
          this.loading.dismiss().then( () => {
            this.countries = data;
            if(this.editData) {
              this.authForm.patchValue({countryId: this.editData.country_id});
              this.editState(this.editData.country_id, this.editData);
            }
          });
        });
      }
    });
  }

  formatRegion(value: any) {
  	let region = {
		region: value.region,
		regionId: 0,
		regionCode: value.region
	};
	if(this.state) {
		const stateRegion = this.state.filter(item => {
			return item.id === value.region;
		});
		region = {
			region: stateRegion[0].name,
			regionId: stateRegion[0].id,
			regionCode: stateRegion[0].code
		};
	}
	return region;
  }

  formatStreet(street) {
  	if(typeof street === "object") {
		street = street[0];
	}
	return street;
  }

  onSubmit(value: any): void { 
    if(this.authForm.valid) {
      this.loading = this.loadingCtrl.create();
      this.loading.present();
      
      const region = this.formatRegion(value);
      value.street = this.formatStreet(value.street);
      
      const address = {
          countryId: value.countryId,
          street: [ value.street ],
          company: value.company,
          telephone: value.telephone,
          postcode: value.postcode,
          city: value.city,
          firstname: value.firstname,
          lastname: value.lastname,
          customerId: this.profile.id
      };
      if(this.editType === 'AddressBook') {
        this.updateAddressBook(address, region, value);
      } else {
        this.updateShippingAddress(address, region);
      }      
    }
  }

  updateShippingAddress(address, region) {
    this.events.publish('shipping-methods-countryid', null, true);
    if(this.isModal) {
      this.saveBilling(this.setShippingAddress(address, region), this.customerToken, this.loading, null);
    } else {
      const others = {
        defaultShipping: true
      };
      this.userService.saveAddresses(this.setCustomerAddress(address, region, others), this.customerToken).then(data => {
        this.saveBilling(this.setShippingAddress(address, region), this.customerToken, this.loading, data);
      });
    }
  }

  updateAddressBook(address, region, value) {
  	const data = this.setCustomerAddress(address, region, value);
    if(this.editData) {
      this.userService.updateAddresses(data, this.customerToken, this.editData['id']).then(data => {
        this.loading.dismiss().then( () => {
          this.viewCtrl.dismiss(true);
          const address_index = this.profile.addresses.map(address => {
            return address.id;
          }).indexOf(data['id']);
          this.profile.addresses[address_index] = data;
          this.events.publish('update-address-book', this.profile);
        });
      });
    } else {
      this.userService.saveAddresses(data, this.customerToken).then(result => {
        this.loading.dismiss().then( () => {
          this.viewCtrl.dismiss(true);
          result['default_shipping'] = data.address.defaultShipping;
          this.profile.addresses.push(result);
          this.events.publish('update-address-book', this.profile);
        });
      });
    }
  }

  setCustomerAddress(address, region, data) {
    const newAddress = Object.assign({}, address);
    const others = {
    	defaultShipping: data['defaultShipping'],
    	defaultBilling: data['defaultShipping'],
    	region: {}
    }
    const save = {
      address : newAddress
    };
    Object.assign(save.address, others)
    Object.assign(save.address.region, region);
    return save;
  }

  setShippingAddress(address, region) {
    const save = {
      address : address,
      useForShipping: true
    };
    const shipping = {
      email: this.profile.email,
      sameAsBilling: 1,
      saveInAddressBook: this.isSaveAddress
    };
    Object.assign(save.address, region, shipping)
    return save;
  }

  saveBilling(save, customerToken, loading, newAddress) {
    this.userService.saveBilling(save, customerToken).then(result => {
      if(result) {
        loading.dismiss().then( () => {
          if(this.isModal) {
            this.viewCtrl.dismiss(true);
            this.events.publish('add-new-shipping-address', save.address);
            this.userService.getShippingMethods(save.address.countryId, this.customerToken).then(data => {
              this.events.publish('shipping-methods-countryid', data, false);
            });
          } else {
            this.profile['addresses'].push(newAddress);
            this.profile['noNewAddress'] = 0;
            this.profile['selected'] = newAddress; 
            this.nav.setRoot('order-confirm', {address: this.profile});
          }
        });
      }
    });
  }

  chooseState(selected) {
    this.country = this.countries.filter(data => {
      return data.id === selected;
    });
    if(this.country[0].available_regions) {
      this.state = this.country[0].available_regions;
    } else {
      if(this.authForm.controls.region.value) {
        //this.authForm.controls.region.value = "";
      }
      this.state = "";
    }
  }

  editState(countryId, state) {
    if(state.region_id > 0) {
      const country = this.countries.filter(data => {
        return data.id === countryId;
      });
      this.state = country[0].available_regions;
      this.authForm.patchValue({region: state.region_id});
    } else {
      this.state = "";
      this.authForm.patchValue({region: state.region.region});
    }
  }

  saveAddress() {
    if(this.isSaveAddress) {
      this.isSaveAddress = 0;
    } else {
      this.isSaveAddress = 1;
    }
  }

  setShipping() {
    if(this.useShipping) {
      this.useShipping = false;
    } else {
      this.useShipping = true;
    }
  }

  // close modal
  closeModal() {
    this.viewCtrl.dismiss(true);
  }
}

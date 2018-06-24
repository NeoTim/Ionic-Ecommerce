import {Component} from '@angular/core';
import {NavController, Events, LoadingController, NavParams, IonicPage} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {UserService} from '../../services/user-service';

@IonicPage({name: 'my-account'})
@Component({
  selector: 'page-my-account',
  templateUrl: 'my-account.html'
})
export class MyAccountPage {
  public profile: any;
  private loading: any;

  constructor(public nav: NavController, public userService: UserService, public storage: Storage, public events: Events, public loadingCtrl: LoadingController, public navParams: NavParams) {
    events.publish('user:loggedIn');
    this.profile = this.navParams.get('profile');
  }

  ionViewCanEnter(): Promise<boolean> {
  	return this.storage.get('customer_token').then(value => {
  		if(!value) {
			 setTimeout(()=>{    
		      this.nav.push('login', {goback: 'my-account'});
		 	});
  			return false;
  		} else {
  			return true;
  		}
  	});
  }

  ionViewDidLoad() {
    this.storage.get('customer_token').then(value => {
      if(value && !this.profile) {
        this.loading = this.loadingCtrl.create();
        this.loading.present();
        this.userService.getProfile(value).then(data => {
          this.loading.dismiss().then( () => {
            this.profile = data;
          });
        });
      }
    });
  }

  // go to changing password page
  changePassword() {
    this.nav.push('change-password', {profile: this.profile});
  }

  editProfile() {
    this.nav.push('edit-profile', {profile: this.profile});
  }

  editAddressBook() {
    this.nav.push('address-book', {profile: this.profile});
  }

  signOut() {
    this.storage.clear();
    this.nav.setRoot('login');
  }
}

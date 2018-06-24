import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NavController, LoadingController, NavParams, IonicPage} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {UserService} from '../../services/user-service';

@IonicPage({name: 'edit-profile'})
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html'
})
export class EditProfilePage {
	
  authForm: FormGroup;
  private loading: any;
  private profile: any;
  private customerToken: any;

  constructor(public nav: NavController, public formBuilder: FormBuilder, public userService: UserService, public loadingCtrl: LoadingController, public navParams: NavParams, public storage: Storage) {
  	this.profile = this.navParams.get('profile');
  	this.authForm = formBuilder.group({
        firstname: ['', Validators.compose([Validators.required])],
        lastname: ['', Validators.compose([Validators.required])]
    });
  }

 ionViewCanEnter(): Promise<boolean> {
    return this.storage.get('customer_token').then(value => {
      if(!value) {
       setTimeout(()=>{    
          this.nav.push('login', {goback: 'edit-profile'});
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
      } else {
        this.customerToken = null;
      }
    });
  }



  // go to home page
  onSubmit(value: any): void { 
    if(this.authForm.valid) {
      this.loading = this.loadingCtrl.create();
      this.loading.present();
      const data = {
        customer: {
          firstname: value.firstname, 
          lastname: value.lastname,
          email: this.profile.email,
          websiteId: 1
        }
      }
      this.userService.updateProfile(data, this.customerToken).then(result => {
        this.loading.dismiss().then( () => {
          this.nav.setRoot('my-account', {profile: result});
        });
      });
    }
  }
}

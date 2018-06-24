import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NavController, IonicPage, LoadingController, ToastController, NavParams, AlertController} from 'ionic-angular';
import {Storage} from '@ionic/storage';

import {UserService} from '../../services/user-service';


@IonicPage({name: 'change-password'})
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html'
})
export class ChangePasswordPage {

  authForm: FormGroup;
  private loading: any;
  public data: any;
  private customerToken: any;
  private profile: any;

  constructor(public nav: NavController, public userService: UserService, public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public storage: Storage, public toastCtrl: ToastController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.profile = this.navParams.get('profile');
    let passwordRegex = '^((?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])|(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^a-zA-Z0-9])|(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])).{8,16}$';

  	this.authForm = formBuilder.group({
        currentPassword: ['', Validators.compose([Validators.required])],
        password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern(passwordRegex)])]
    });
  }

  ionViewCanEnter(): Promise<boolean> {
  	return this.storage.get('customer_token').then(value => {
  		if(!value) {
			setTimeout(()=>{    
		      this.nav.push('login');
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

  onSubmit(value: any): void { 
  	if(this.authForm.valid) {
  	  this.loading = this.loadingCtrl.create();
      this.loading.present();
  	  const data = {
  		  currentPassword: value.currentPassword,
  		  newPassword: value.password
  	  };
      this.userService.savePassword(this.customerToken, data).then(result => {
    		this.loading.dismiss().then( () => {
    		  let toast = this.toastCtrl.create({
              message: 'You saved the information',
              duration: 1000,
              position: 'middle'
  		  });

		    toast.present();
  		  this.nav.setRoot('my-account', {profile: this.profile});
  		});
	  }, err => {
  		  this.loading.dismiss().then( () => {
        let alert = this.alertCtrl.create({
          message: JSON.parse(err._body).message,
          buttons: ['OK']
        });
        alert.present();
  		});
	  });
  	}
  }
}

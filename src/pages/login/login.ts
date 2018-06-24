import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NavController, LoadingController, AlertController, NavParams, IonicPage} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {UserService} from '../../services/user-service';

@IonicPage({name: 'login'})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  authForm: FormGroup;
  private loading: any;
  private goback: any;
  private addAddress: any;
  private showPass: boolean = false;
  private type = 'password';
  
  constructor(public nav: NavController, public formBuilder: FormBuilder, public userService: UserService, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public storage: Storage, public navParams: NavParams) {
  	this.goback = this.navParams.get('goback');
    this.addAddress = this.navParams.get('addAddress');
    let emailRegex = '^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$';
  	this.authForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
        password: ['', Validators.compose([Validators.required, Validators.minLength(8)])]
    });
  }

  // go to register page
  register() {
    this.nav.push('register', {goback: this.goback, addAddress: this.addAddress});
  }

  showPassword() {
    this.showPass = !this.showPass;
 
    if(this.showPass){
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  // go to home page
  onLogin(value: any): void { 
    if(this.authForm.valid) {
      this.loading = this.loadingCtrl.create();
      this.loading.present();
      this.userService.isValidUser(value.email, value.password).then(data => {
        if(data) {
          this.loading.dismiss().then( () => {
          	this.storage.set('email', value.email);
          	this.storage.set('customer_id', data['user']['id']);
            this.storage.set('customer_token', data['token']);
            if(this.addAddress && data['user']['addresses'].length === 0) {
              this.nav.push(this.addAddress, {profile: data['user'], modal: false});
            }
            else if(this.goback) {
              const params = {};
              if(this.addAddress) {
                data['user']['noNewAddress'] = 1;
                data['user']['selected'] = data['user']['addresses'][0];
                params['address'] = data['user'];
              }
              this.nav.setRoot(this.goback, params);
            } else {
              this.nav.setRoot('my-account', {profile: data['user']});
            }
          });
        } else {
          this.loading.dismiss().then( () => {
            let alert = this.alertCtrl.create({
              message: 'Invalid user. Please login valid one.',
              buttons: ['OK']
            });
            alert.present();
          });
        }
      }, err => {
    		this.loading.dismiss().then( () => {
    			let alert = this.alertCtrl.create({
    				message: 'Invalid user. Please login valid one.',
    				buttons: ['OK']
    			});
    			alert.present();
    		});
      });
    }
  }

  // go to forgot password page
  forgotPwd() {
    this.nav.push('forgot-password');
  }
}

import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NavController, LoadingController, AlertController, NavParams, IonicPage} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {UserService} from '../../services/user-service';

@IonicPage({name: 'register'})
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
	
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
    let passwordRegex = '^((?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])|(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^a-zA-Z0-9])|(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9])).{8,16}$';
  	this.authForm = formBuilder.group({
        firstname: ['', Validators.compose([Validators.required])],
        lastname: ['', Validators.compose([Validators.required])],
        email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
        password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern(passwordRegex)])]
    });
  }

  // go to login page
  login() {
    this.nav.push('login');
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
  onSubmit(value: any): void { 
    if(this.authForm.valid) {
      this.loading = this.loadingCtrl.create();
      this.loading.present();
      this.userService.checkEmail(value.email).then(result => {
        if(!result) {
          this.loading.dismiss().then( () => {
            const alert = this.alertCtrl.create({
              message: 'Email already exists',
              buttons: ['OK']
            });
            alert.present();
          });
        } else {
    		  const data = {
      			customer: {
      			  email: value.email,
      			  firstname: value.firstname,
      			  lastname: value.lastname
      			},
      			password: value.password
    		  };
          this.userService.register(data).then(result => {
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
    		            this.loading.dismiss().then( () => {
    		              this.nav.setRoot(this.goback, params);
    		            });
                  } else {
    		            this.loading.dismiss().then( () => {
    		              this.nav.setRoot('my-account', {profile: data['user']});
    		            });
		              }
              	});
              }
            });
          }, err => {
              this.loading.dismiss().then( () => {
                const alert = this.alertCtrl.create({
                  message: 'Please enter valid details',
                  buttons: ['OK']
                });
                alert.present();
              });
          });
        }
      });
    }
  }
}

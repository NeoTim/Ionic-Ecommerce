import {Component} from '@angular/core';
import {NavController, NavParams, LoadingController, IonicPage} from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {UserService} from '../../services/user-service';
import {MidtransService} from '../../services/midtrans-service';

@IonicPage({name: 'payment-method'})
@Component({
  selector: 'page-payment-method',
  templateUrl: 'payment-method.html'
})
export class PaymentMethodPage {
  public totals: any;
  private loading: any;
  public customerToken: any;
  public payments: any;
  public billing: any;

  constructor(public nav: NavController, public navParams: NavParams, public storage: Storage, public userService: UserService, public loadingCtrl: LoadingController, public midtransService: MidtransService) {
    // set cart data
    this.billing = this.navParams.get('billing');
    this.totals = "";
    this.payments = "";
  }

  ionViewCanEnter(): Promise<boolean> {
    return this.storage.get('customer_token').then(value => {
      if(!value) {
        setTimeout(()=>{    
          this.nav.push('login', {goback: 'payment-method'});
        });
        return false;
      } else {
        return true;
      }
    });
  }

  ionViewDidLoad() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    this.storage.get('customer_token').then(value => {
      if(value) {
        this.customerToken = value;
        this.userService.getPaymentMethods(this.customerToken).then(data => {
          this.loading.dismiss().then( () => {
            this.payments = data;
          });
        });
      }
    });
  }

  // place order
  buy() {
    this.loading = this.loadingCtrl.create();
    this.loading.present();
    const data = {
      paymentMethod: {
        method: 'midtrans'
      },
      billingAddress: {}
    };
    Object.assign(data.billingAddress , this.billing);
    this.userService.placeOrder(data, this.customerToken).then(data => {
      this.loading.dismiss().then( () => {
        this.midtransService.getToken(data, 10000);
        //this.nav.setRoot('order-received', {orderId: data});
      });
    });
  }
}

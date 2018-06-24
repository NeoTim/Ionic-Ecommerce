import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';
import {NavController, LoadingController, NavParams, IonicPage} from 'ionic-angular';
import {OrderService} from "../../services/order-service";
import {ENV} from '@environment';

@IonicPage({name: 'order-received'})
@Component({
  selector: 'page-order-received',
  templateUrl: 'order-received.html'
})
export class OrderReceivedPage {
  // sample data
  public orders: any;
  private loading: any;
  private orderId: any;
  private currencySym: any;

  constructor(public nav: NavController, public orderService: OrderService, public storage: Storage, public loadingCtrl: LoadingController, public navParams: NavParams) {
    // set sample data
    this.orderId = this.navParams.get('orderId');
    this.currencySym = ENV.CURRENCY_SYMBOL;
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
    this.storage.get('customer_token').then(token => {
      if(token) {
        this.loading = this.loadingCtrl.create();
        this.loading.present();
        this.orderService.getOrderDetails(token, this.orderId).then(data => {
          this.loading.dismiss().then( () => {
            this.orders = data;
          });
        });
      }
    });
  }

  continue() {
  	this.nav.setRoot('welcome');
  }
}

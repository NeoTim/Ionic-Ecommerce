import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';
import {NavController, LoadingController, NavParams, IonicPage} from 'ionic-angular';
import {OrderService} from "../../services/order-service";
import {ENV} from '@environment';


@IonicPage({name: 'order-details'})
@Component({
  selector: 'page-order-details',
  templateUrl: 'order-details.html'
})
export class OrderDetailsPage {
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
            this.orders['shipping_address'] = this.orders['extension_attributes']['shipping_assignments'][0]['shipping']['address'];
          });
        });
      }
    });
  }

  continue() {
  	this.nav.setRoot('home');
  }
}

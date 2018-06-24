import {Component} from '@angular/core';
import {Storage} from '@ionic/storage';
import {NavController, LoadingController, IonicPage} from 'ionic-angular';
import {OrderService} from "../../services/order-service";
import {ENV} from '@environment';

@IonicPage({name: 'my-order'})
@Component({
  selector: 'page-my-order',
  templateUrl: 'my-order.html'
})
export class MyOrderPage {
  // sample data
  public orders: any;
  public customerToken: any;
  private loading: any;
  private images: any;
  private noItems: any;
  private currencySym: any;

  constructor(public nav: NavController, public orderService: OrderService, public storage: Storage, public loadingCtrl: LoadingController) {
    // set sample data
    this.noItems = "";
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

  viewOrder(id) {
  	this.nav.push('order-details', {orderId: id});
  }

  loadThumb(orders) {
    this.images = {};
    orders.map((order, orderIndex) => {
      order.items.map((item, index) => {
        const identity = 'thumb' + orderIndex + index;
        this.images[identity] = null;
        this.orderService.getThumb(item.sku, identity).then(data => {
          this.images[data.index] = data.thumb;
        });
      });
    });
  }

  ionViewDidLoad() {
    this.storage.get('customer_token').then(token => {
      if(token) {
        this.storage.get('customer_id').then(id => {
          this.customerToken = token;
          this.loading = this.loadingCtrl.create();
          this.loading.present();
          this.orderService.getAll(token, id).then(data => {
            this.loading.dismiss().then( () => {
              this.orders = data['items'];
              this.loadThumb(this.orders);
            });
          }, err => {
          	this.loading.dismiss().then( () => {
          		this.noItems = 'No orders are placed';
          	});
          });
        });
      }
    });
  }
}

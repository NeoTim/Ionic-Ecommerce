import {Component} from '@angular/core';
import {Platform, Events} from 'ionic-angular';
import {ViewChild} from '@angular/core';
import {Storage} from '@ionic/storage';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

// import services
import {CartService} from '../services/cart-service';

@Component({
  templateUrl: 'app.html',
  queries: {
    nav: new ViewChild('content')
  }
})
export class MyApp {

  public rootPage: any = 'welcome';

  public nav: any;

  public pages = [
    {
      title: 'Home',
      icon: 'ios-home-outline',
      count: 0,
      component: 'welcome'
    },

    {
      title: 'Categories',
      icon: 'ios-list-box-outline',
      count: 0,
      component: 'categories-list'
    },

    {
      title: 'My Order',
      icon: 'ios-timer-outline',
      count: 0,
      component: 'my-order'
    },

    {
      title: 'Midtrans',
      icon: 'ios-timer-outline',
      count: 0,
      component: 'midtrans'
    },

    {
      title: 'My Account',
      icon: 'ios-contact-outline',
      count: 0,
      component: 'my-account'
    },

    {
      title: 'Cart',
      icon: 'ios-cart-outline',
      count: 0,
      component: 'carts'
    },

    {
      title: 'Login',
      icon: 'log-out',
      count: 0,
      component: 'login'
    },
    // import menu
  ];

  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public storage: Storage, public events: Events, public cartService: CartService) {
    this.rootPage = 'welcome';

    this.events.subscribe('user:loggedIn', (() => {
    	this.checkLoggedIn();
    }));

    this.events.subscribe('carts-count', (() => {
      this.checkCartsCount();
    }));
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  checkCartsCount() {
    this.storage.get('customer_token').then(value => {
      if(value) {
        this.cartsCount(value);
      } else {
        this.cartsCount(null);
      }
    });
  }

  checkLoggedIn() {
    this.storage.get('customer_token').then(value => {
      if(value) {
        this.pages.pop();
        this.pages.push({
          title: 'Logout',
          icon: 'log-out',
          count: 0,
          component: 'login'
        });
      } else {
      	this.pages.pop();
        this.pages.push({
          title: 'Login',
          icon: 'log-out',
          count: 0,
          component: 'login'
        });
      }
    });
  }

  cartsCount(customerToken) {
    this.cartService.getCartsCount(customerToken).then(data => {
      const carts = this.pages.filter(item => {
        return item.title === 'Cart';
      });
      carts[0].count = data.items_qty ? data.items_qty : 0;
    })
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.title === 'Logout') {
      this.storage.clear();
	  this.events.publish('user:loggedIn');
    }
    this.nav.setRoot(page.component);
  }

  ngAfterViewInit() {
    this.checkLoggedIn();
    this.checkCartsCount();
  }
}



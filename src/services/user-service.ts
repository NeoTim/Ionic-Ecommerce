import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import "rxjs/add/operator/map";
import 'rxjs/add/operator/mergeMap';
import {USERS} from "./mock-users";
import { ENV } from '@environment';

@Injectable()
export class UserService {
  private users: any;
  public countries: any;

  constructor(private http: Http) {
    this.users = USERS;
  }

  getAll() {
    return this.users;
  }

  checkEmail(email) {
  	let headerProperties = {'Content-Type': 'application/json'};
	let headers = new Headers(headerProperties);
	let options = new RequestOptions({ headers: headers });  
	const data = {
		customerEmail: email,
		websiteId: 1
	}; 
	return this.http.post(ENV.API_ENDPOINT + 'customers/isEmailAvailable', data, options)
	.map(res => res.json())
	.toPromise();
  }

  isValidUser(email, pwd) {
    return new Promise((resolve, reject) => {
      let data = {
        username: email,
        password: pwd
      };
      let headerProperties = {'Content-Type': 'application/json'};
      let headers = new Headers(headerProperties);
      let options = new RequestOptions({ headers: headers });   
      this.http.post(ENV.API_ENDPOINT + 'integration/customer/token', data, options)
      .map(res => res.json())
      .mergeMap(token => {
        headerProperties['Authorization'] = 'Bearer ' + token;
        let headers = new Headers(headerProperties);
        let options = new RequestOptions({ headers: headers });
        return this.http.get(ENV.API_ENDPOINT + 'customers/me', options)
        .map(res => {
          const user = res.json();
          return {
            token: token,
            user: user
          }
        })
      })
      .subscribe(
        data => resolve(data),
        err => reject(err)
      );
    });
  }

  register(data) {
    let headerProperties = {'Content-Type': 'application/json'};
    let headers = new Headers(headerProperties);
    let options = new RequestOptions({ headers: headers }); 
	return this.http.post(ENV.API_ENDPOINT + 'customers', data, options)
	.map(res => res.json())
	.toPromise();
  }

  callNextPage(customerToken, loading, nav, addressPage, orderPage) {
    if(customerToken) {
      this.getAddress(customerToken).then(data => {
        loading.dismiss().then( () => {
          if(data['addresses'] && data['addresses'].length === 0) {
            nav.push(addressPage, {profile: data, modal: false});
          } else {
            nav.setRoot(orderPage, {address: data});
          }
        });
      });
    } else {
	  loading.dismiss().then( () => {
      	nav.setRoot(orderPage);
      });
    }
  }

  getProfile(customerToken) {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + customerToken});
    let options = new RequestOptions({ headers: headers });
    return this.http.get(ENV.API_ENDPOINT + 'customers/me', options)
    .map(res => res.json())
    .toPromise();
  }

  updateProfile(data, customerToken) {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + customerToken});
    let options = new RequestOptions({ headers: headers });
    return this.http.put(ENV.API_ENDPOINT + 'customers/me', data, options)
    .map(res => res.json())
    .toPromise();
  }

  getAddress(customerToken) {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + customerToken});
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      return this.http.get(ENV.API_ENDPOINT + 'customers/me', options)
      .map(res => res.json())
      .mergeMap(carts => {
        return this.http.get(ENV.API_ENDPOINT + 'carts/mine', options)
        .map(res => {
          const data = res.json();
          const shipping = data.extension_attributes.shipping_assignments[0].shipping.address;
          let noNewAddress = 1;
          if(shipping.country_id) {
            const matchNewAddress = carts.addresses.map(item => {
              return item.id;
            }).indexOf(shipping.customer_address_id);
            if(matchNewAddress === -1) {
              carts.addresses.push(shipping);
              noNewAddress = 0;
            }
          }
          carts['noNewAddress'] = noNewAddress;
          return carts;
        })
      })
      .subscribe(data => {
        data['selected'] = [];
        if(data['addresses'].length > 0) {
          data['selected'] = data['addresses'][0];
        }
        resolve(data);
      },
      err => reject(err));
    });
  }

  getShippingMethods(countryId, customerToken) {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + customerToken});
    let options = new RequestOptions({ headers: headers });
    const data = {
      address : {
        countryId : countryId
      }
    };
    return new Promise((resolve, reject) => {
      return this.http.post(ENV.API_ENDPOINT + 'carts/mine/estimate-shipping-methods', data, options)
      .map(res => res.json())
      .subscribe(data => {
          data['selected'] = data[0];
          resolve(data);
        },
        err => reject(err)
      );
    });
  }

  saveBilling(data, customerToken) {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + customerToken});
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      return this.http.post(ENV.API_ENDPOINT + 'carts/mine/billing-address', data, options)
      .map(res => res.json())
      .subscribe(
        data => resolve(data),
        err => reject(err)
      );
    });
  }

  savePassword(customerToken, data) {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + customerToken});
    let options = new RequestOptions({ headers: headers });
    return this.http.put(ENV.API_ENDPOINT + 'customers/me/password', data, options)
    .map(res => res.json())
    .toPromise();
  }

  saveAddresses(data, customerToken) {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + customerToken});
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      return this.http.post(ENV.API_ENDPOINT + 'customers/addresses/mine', data, options)
      .map(res => res.json())
      .subscribe(
        data => resolve(data),
        err => reject(err)
      );
    });
  }

  updateAddresses(data, customerToken, id) {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + customerToken});
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      return this.http.put(ENV.API_ENDPOINT + 'customers/addresses/mine/' + id, data, options)
      .map(res => res.json())
      .subscribe(
        data => resolve(data),
        err => reject(err)
      );
    });
  }

  placeOrder(data, customerToken) {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + customerToken});
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      return this.http.post(ENV.API_ENDPOINT + 'carts/mine/payment-information', data, options)
      .map(res => res.json())
      .subscribe(
        data => resolve(data),
        err => reject(err)
      );
    });
  }

  getCountries() {
    if (this.countries) {
      return Promise.resolve(this.countries);
    }
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      return this.http.get(ENV.API_ENDPOINT + 'directory/countries', options)
      .map(res => {
        this.countries = res.json();
        return this.countries;
      })
      .subscribe(
        data => resolve(data),
        err => reject(err)
      );
    });
  }

  checkoutShipping(data, customerToken) {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + customerToken});
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      return this.http.post(ENV.API_ENDPOINT + 'carts/mine/shipping-information', data, options)
      .map(res => res.json())
      .subscribe(
        data => resolve(data),
        err => reject(err)
      );
    });
  }

  getPaymentMethods(customerToken) {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + customerToken});
    let options = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      return this.http.get(ENV.API_ENDPOINT + 'carts/mine/payment-information', options)
      .map(res => res.json())
      .subscribe(
        data => resolve(data),
        err => reject(err)
      );
    });
  }

  getItem(id) {
    for (var i = 0; i < this.users.length; i++) {
      if (this.users[i].id === parseInt(id)) {
        return this.users[i];
      }
    }
    return null;
  }

  remove(item) {
    this.users.splice(this.users.indexOf(item), 1);
  }
}

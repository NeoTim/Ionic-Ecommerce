import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';
import {ENV} from '@environment';


@Injectable()
export class CartService {
  private carts: any;

  constructor(private http: Http) {
  }

  getCartItems(customerToken) {
    const quoteId = localStorage.getItem('quoteId')
    let url = ENV.API_ENDPOINT + 'guest-carts/' + quoteId + '/items';
    let headerProperties = {'Content-Type': 'application/json'};
    if(customerToken) {
      url = ENV.API_ENDPOINT + 'carts/mine/items';
      headerProperties['Authorization'] = 'Bearer ' + customerToken;
    }
    let headers = new Headers(headerProperties);
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options)
    .map(res => res.json())
    .mergeMap(carts => {
      if(carts.length === 0) {
        return Observable.of([]);
      }
      return Observable.forkJoin(
        carts.map((cart: any) => {
          cart.is_visible = true;
          return this.cartOfProduct(cart, options);
        })
      )
    }) 
    .toPromise();
  }

  getCartsCount(customerToken) {
    const quoteId = localStorage.getItem('quoteId');
    if(!quoteId) {
        return Promise.resolve([]);
    }
    let url = ENV.API_ENDPOINT + 'guest-carts/' + quoteId;
    let headerProperties = {'Content-Type': 'application/json'};
    if(customerToken) {
      url = ENV.API_ENDPOINT + 'carts/mine';
      headerProperties['Authorization'] = 'Bearer ' + customerToken;
    }
    let headers = new Headers(headerProperties);
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url, options)
    .map(res => res.json())
    .toPromise();
  }

  cartGuestToMine(customerToken) {
    const quoteId = localStorage.getItem('quoteId');
    let url = ENV.API_ENDPOINT + 'guest-carts/' + quoteId;
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + customerToken});
    let options = new RequestOptions({ headers: headers });
    return this.http.get(url, options)
    .map(res => res.json())
    .mergeMap(guest => {
      url = ENV.API_ENDPOINT + 'carts/mine';
      return this.http.get(url, options)
      .map(res => {
        const customer = res.json(); 
        let newCart = {
          "quote": {
            "id": guest.id, //this is the numeric id for a guest-cart
            "customer": {
              "id": customer.customer.id //this is the numeric id for the customer
            }
          }
        };
        return newCart;
      })
      .mergeMap(carts => {
        return this.http.put(url, carts, options)
        .map(res => res.json())
      }) 
    })
    .toPromise();
  }

  cartOfProduct(cart, options) {
    return this.http.get(ENV.API_ENDPOINT + 'products/' + cart.sku, options)
    .map(res => {
      const prod = res.json();
      if (cart.product_option) {
        const customOptions = cart.product_option.extension_attributes.custom_options;
        customOptions.map(item => {
          const i = prod.options.map(option => {
            return option.option_id;
          }).indexOf(parseInt(item.option_id));
          item.title = prod.options[i].title;
          if(prod.options[i].values) {
            const option_values = prod.options[i].values.filter(option => {
              return option.option_type_id === parseInt(item.option_value);
            });
            item.value_title = option_values[0].title;
          } else {
            item.value_title = item.option_value;
          }
          return item;
        });
      }
      const image = prod.custom_attributes.filter(attr => {
        return attr.attribute_code === 'small_image';
      })
      cart['image'] = ENV.PRODUCT_IMAGE_ENDPOINT + image[0].value;
      return cart;
    });
  }

  deleteCartItems(itemId, customerToken) {
    const quoteId = localStorage.getItem('quoteId')
    let url = ENV.API_ENDPOINT + 'guest-carts/' + quoteId + '/items/' + itemId;
    let headerProperties = {'Content-Type': 'application/json'};
    if(customerToken) {
      url = ENV.API_ENDPOINT + 'carts/mine/items/' + itemId;
      headerProperties['Authorization'] = 'Bearer ' + customerToken;
    }
    let headers = new Headers(headerProperties);
    let options = new RequestOptions({ headers: headers });

    return this.http.delete(url, options)
    .map(res => res.json()) 
    .toPromise();
  }

  getCartsTotal(customerToken) {
    const quoteId = localStorage.getItem('quoteId')
    let url = ENV.API_ENDPOINT + 'guest-carts/' + quoteId  + '/totals';
    let headerProperties = {'Content-Type': 'application/json'};
    if(customerToken) {
      url = ENV.API_ENDPOINT + 'carts/mine/totals';
      headerProperties['Authorization'] = 'Bearer ' + customerToken;
    }
    let headers = new Headers(headerProperties);
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options)
    .map(res => res.json()) 
    .toPromise();
  }

  getItem(id) {
    for (var i = 0; i < this.carts.length; i++) {
      if (this.carts[i].id === parseInt(id)) {
        return this.carts[i];
      }
    }
    return null;
  }

  remove(item) {
    this.carts.splice(this.carts.indexOf(item), 1);
  }
}

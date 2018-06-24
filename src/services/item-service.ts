import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';
import { ENV } from '@environment';


@Injectable()
export class ItemService {
  private items: any;
  private data: any;
  private quoteId: any;


  constructor(private http: Http) {
  }

  getAll() {
    return this.items;
  }

  getCustomerId(customerToken) {
    let headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + customerToken});
    let options = new RequestOptions({ headers: headers });
    return this.http.post(ENV.API_ENDPOINT + 'carts/mine', {}, options)
    .map(res => res.json()).toPromise();
  }

  productOption(cart, item) {
    const options = cart.product_option.extension_attributes.custom_options; 
    const filtered = options.filter((option: any) => {
      return item.choosed_options[option.option_id] === parseInt(option.option_value);
    });

    if(options.length === filtered.length) {
      return true;
    }
    return false;
  }

  addCart(item, customerToken) {
    return new Promise((resolve, reject) => {
      this.getCustomerId(customerToken).then(customerId => {
        this.userProductToCart(item, customerId, customerToken).subscribe(
          data => resolve(data),
          err => reject(err)
        );
      }, err => {
        this.guestProductToCart(item).subscribe(
          data => resolve(data),
          err => reject(err)
        );
      });
    });
  }

  setCartItems(item, quoteId) {
    let newItems = {
      cartItem: {
        quoteId: quoteId,
        sku: item.sku,
        name: item.name,
        qty: item.qty,
        productType: item.type_id,
        price: item.option_price,
        productOption: {
          extensionAttributes : {
            customOptions: []
          }
        }
      }
    };
    let options = newItems.cartItem.productOption.extensionAttributes.customOptions;
    for(let i = 0; i < item.options.length; i++) {
      if(item.options[i]['currentOption']) {
        options.push({
          optionId: item.options[i]['option_id'], 
          optionValue: item.options[i]['currentOption']['option_type_id'],
        });
      }
    }
    return newItems;
  }

  createGuestId() {
    if (localStorage.getItem('quoteId')) {
      this.quoteId = localStorage.getItem('quoteId');
      return Observable.of(this.quoteId);
    }
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });   
    return this.http.post(ENV.API_ENDPOINT + 'guest-carts', {}, options)
    .map(res => {
      this.quoteId = res.json();
      localStorage.setItem('quoteId', this.quoteId);
      return this.quoteId;
    });
  }

  guestProductToCart(item) {
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({ headers: headers });   
    return this.createGuestId()
    .mergeMap(quoteId => {
      const url = ENV.API_ENDPOINT + 'guest-carts/' + quoteId + '/items';
      return this.http.get(url, options)
      .map(res => {
        const data = res.json();
        const itemId = data.filter((cart: any) => {
          return cart.sku === item.sku && this.productOption(cart, item)
        });
        return {
          quoteId: quoteId,
          item: itemId,
          url: url
        }
      })
    })
    .mergeMap(carts => this.performCarts(carts, item, options))
    .map(res => res.json());
  }

  userProductToCart(item, customerId, customerToken) {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + customerToken});
    const options = new RequestOptions({ headers: headers }); 
    const url = ENV.API_ENDPOINT + 'carts/mine/items';
    return this.http.get(url, options)
    .map(res => {
      const data = res.json();
      let itemId = [];
      if(data.length > 0) {
        itemId = data.filter((cart: any) => {
          return cart.sku === item.sku && this.productOption(cart, item);
        });
      }
      return {
        item: itemId,
        quoteId: customerId,
        url: url
      }
    })
    .mergeMap(carts => this.performCarts(carts, item, options))
    .map(res => res.json());
  }

  performCarts(data, item, options) {
    let newItems = this.setCartItems(item, data.quoteId);
    if(data.item.length > 0) {
      const itemId = data.item[0]['item_id'];
      return this.http.put(data.url + '/' + itemId, newItems, options);
    } else {
      return this.http.post(data.url, newItems, options);
    }
  }

  getBySearchData(searchData, method, query) {
    return new Promise(resolve => {
      let headers = new Headers({'Content-Type': 'application/json'});
      let options = new RequestOptions({ headers: headers });   
      
      let url = ENV.API_ENDPOINT + 'products?searchCriteria[filter_groups][0][filters][0][field]=name&searchCriteria[filter_groups][0][filters][0][value]=' + searchData + '%&searchCriteria[filter_groups][0][filters][0][condition_type]=like';

      if(method ==='sorts' && query) {
       url = url + '&searchCriteria[sortOrders][0][field]=price&searchCriteria[sortOrders][0][direction]=' + query;
      }

      if(method ==='filter' && query) {
       url = url + '&searchCriteria[filter_groups][1][filters][0][field]=price&searchCriteria[filter_groups][1][filters][0][value]=' + query.from + '&searchCriteria[filter_groups][1][filters][0][condition_type]=from&searchCriteria[filter_groups][2][filters][0][field]=price&searchCriteria[filter_groups][2][filters][0][value]=' + query.to + '&searchCriteria[filter_groups][2][filters][0][condition_type]=to';
      }

      this.http.get(url, options)
      .map(res => res.json())
      .subscribe(data => {
        this.data = this.rearrangeCustomAttr(data.items);
        resolve(this.data);
      });
    });
  }

  getDealsProducts() {
    return new Promise(resolve => {
      let headers = new Headers({'Content-Type': 'application/json'});
      let options = new RequestOptions({ headers: headers });   
        
      let url = ENV.API_ENDPOINT + 'products?searchCriteria[sortOrders][0][field]=special_price&searchCriteria[sortOrders][0][direction]=DESC&searchCriteria[pageSize]=4';

      this.http.get(url, options)
      .map(res => res.json())
      .subscribe(data => {
        resolve(this.rearrangeCustomAttr(data.items));
      });
    });
  }

  getByCategory(catId, method, query)  {
    return new Promise(resolve => {
      let headers = new Headers({'Content-Type': 'application/json'});
      let options = new RequestOptions({ headers: headers });   
      
      let url = ENV.API_ENDPOINT + 'products?searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=' + catId;

      if(method ==='sorts' && query) {
       url = url + '&searchCriteria[sortOrders][0][field]=price&searchCriteria[sortOrders][0][direction]=' + query;
      }

      if(method ==='filter' && query) {
       url = url + '&searchCriteria[filter_groups][1][filters][0][field]=price&searchCriteria[filter_groups][1][filters][0][value]=' + query.from + '&searchCriteria[filter_groups][1][filters][0][condition_type]=from&searchCriteria[filter_groups][2][filters][0][field]=price&searchCriteria[filter_groups][2][filters][0][value]=' + query.to + '&searchCriteria[filter_groups][2][filters][0][condition_type]=to';
      }

      this.http.get(url, options)
      .map(res => res.json())
      .subscribe(data => {
        this.data = this.rearrangeCustomAttr(data.items);
        resolve(this.data);
      });
    });
  }

  rearrangeCustomAttr(data) {
    const tot_data = data.length
    for (let i = 0; i < tot_data; i++) {
      let custom_attributes = {};
      const attr = data[i].custom_attributes;
      const tot_items = attr.length;
      for (let j = 0; j < tot_items; j++) {
          custom_attributes[attr[j].attribute_code] = attr[j].value
      }
      data[i].custom_attributes = custom_attributes;
    }
    return data;
  }

  productCustomAttr(data) {
    let custom_attributes = {};
    const attr = data.custom_attributes;
    const tot_items = attr.length;
    for (let j = 0; j < tot_items; j++) {
      custom_attributes[attr[j].attribute_code] = attr[j].value
    }
    data.custom_attributes = custom_attributes;
    return data;
  }

  getItems(sku) {
    return new Promise(resolve => {
      let headers = new Headers({'Content-Type': 'application/json'});
      let options = new RequestOptions({ headers: headers });   
      
      this.http.get(ENV.API_ENDPOINT + 'products/'+sku, options)
      .map(res => res.json())
      .subscribe(data => {
        this.data = this.productCustomAttr(data);
        resolve(this.data);
      });
    });
  }

  updateItem(customerToken, item, option) {
    let newItems = {
      cartItem : {
        itemId: item.item_id,
        qty: (option === 'add' ? item.qty + 1 : item.qty - 1),
        quoteId: item.quote_id
      }
    };
    let url = ENV.API_ENDPOINT + 'guest-carts/' + item.quote_id  + '/items/' + item.item_id;
    let headerProperties = {'Content-Type': 'application/json'};
    if(customerToken) {
      url = ENV.API_ENDPOINT + 'carts/mine/items/' + item.item_id;
      headerProperties['Authorization'] = 'Bearer ' + customerToken;
    }
    let headers = new Headers(headerProperties);
    let options = new RequestOptions({ headers: headers });
    return this.http.put(url, newItems, options)
    .map(res => res.json()) 
    .toPromise();
  }

  getItem(id) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].id === parseInt(id)) {
        return this.items[i];
      }
    }
    return null;
  }

  remove(item) {
    this.items.splice(this.items.indexOf(item), 1);
  }
}

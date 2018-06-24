import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/mergeMap';
//import {Observable} from 'rxjs/Observable';
//import 'rxjs/add/observable/forkJoin';
import { ENV } from '@environment';

@Injectable()
export class OrderService {

  constructor(private http: Http) {
  }

  getAll(customerToken, email) {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + customerToken});
    const options = new RequestOptions({ headers: headers });   
    
    return this.http.get(ENV.API_ENDPOINT + 'orders/mine?searchCriteria[filter_groups][0][filters][0][field]=customer_id&searchCriteria[filter_groups][0][filters][0][value]=' + email, options)
    .map(res => res.json())
    .toPromise();
  }

  getThumb(sku, index) {
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({ headers: headers });   
    return this.http.get(ENV.API_ENDPOINT + 'products/' + sku, options)
    .map(res => {
      const data = res.json();
      const image = data.custom_attributes.filter(item => {
        return item.attribute_code === 'image';
      });
      return {
        thumb: ENV.PRODUCT_IMAGE_ENDPOINT + image[0].value,
        index: index
      }
    })
    .toPromise();
  }

  cartOfProduct(cart, options) {
    return this.http.get(ENV.API_ENDPOINT + 'products/' + cart.sku, options)
    .map(res => {
      const prod = res.json();
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
      const image = prod.custom_attributes.filter(attr => {
        return attr.attribute_code === 'small_image';
      })
      cart['image'] = ENV.PRODUCT_IMAGE_ENDPOINT + image[0].value;
      return cart;
    });
  }

  getOrderDetails(customerToken, id) {
    const headers = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + customerToken});
    const options = new RequestOptions({ headers: headers });   
    
    return this.http.get(ENV.API_ENDPOINT + 'orders/mine/'+ id, options)
    .map(res => res.json())
    /*.mergeMap(order => {
      return Observable.forkJoin(
        order['items'].map((item: any) => {
          return this.cartOfProduct(item, options);
        })
      )
    }) */
    .toPromise();
  }
}

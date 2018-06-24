import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Storage} from '@ionic/storage';
import "rxjs/add/operator/map";
import { ENV } from '@environment';

@Injectable()
export class CategoryService {
  private categories: any;
  private data: any;


  constructor(private http: Http, public storage: Storage) {
  }

  getA()  {
  	if (this.data) {
  		return Promise.resolve(this.data);
  	}
    let headers = new Headers({'Content-Type': 'application/json'});
    //let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({ headers: headers });   
      
    return this.http.get(ENV.API_ENDPOINT + 'categories', options)
    .map(res => {
      this.data = res.json();
      return this.data;
    })
    .toPromise();
  }

  search(value) {
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });   
      
    return this.http.get(ENV.API_ENDPOINT + 'products?searchCriteria[filter_groups][0][filters][0][field]=name&searchCriteria[filter_groups][0][filters][0][value]=' + value + '%&searchCriteria[filter_groups][0][filters][0][condition_type]=like', options)
    .map(res => {
      const data = res.json();
      const lists = [];
      data.items.map((product) => {
        const name = product.name.split(" ");
        lists.push({type: 'product', value: name[0]});
      });
      return lists;
    })
    .toPromise();
  }



  remove(item) {
    this.categories.splice(this.categories.indexOf(item), 1);
  }
}

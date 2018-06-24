import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import "rxjs/add/operator/map";

import { ENV } from '@environment';

@Injectable()
export class MidtransService {

  constructor(private http: Http) {
  }

  getToken(order_id, gross_amount) {
    const server_key = ENV.MIDTRANS_SERVER_KEY;
    const auth = btoa(server_key);
    const data = {
      "transaction_details": {
        "order_id": order_id,
        "gross_amount": gross_amount
      }
    };
    let headers = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Basic ' + auth});
    let options = new RequestOptions({ headers: headers });   
    return this.http.post(ENV.MIDTRANS_ENDPOINT + 'transactions', data, options)
    .map(res => res.json())
    .subscribe(data => {
        window.open(data.redirect_url, '_self');
    });
  }
}

import {Component} from '@angular/core';
import {NavController, IonicPage} from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
//import { Base64 } from '@ionic-native/base64';
//import { BrowserTab } from '@ionic-native/browser-tab';
import {ENV} from '@environment';



@IonicPage({name: 'midtrans'})
@Component({
  selector: 'page-midtrans',
  templateUrl: 'midtrans.html'
})
export class MidtransPage {
  private win: any;

  constructor(public nav: NavController, private http: Http) {
    
    
  }

  loadExtScript(src) {
    var s = document.createElement('script');
    s.src = src;
    s.setAttribute('data-client-key', 'SB-Mid-client-hlQHlcXoTUe2pgBB');
    //s['data-client-key'] = ;
    document.body.appendChild(s);
  }

  /*execSnapCont(snap_token) {
    var self = this;
    var callbackTimer = setInterval(function() {
                var snapExecuted = false;
                try{
                    snap.pay(snap_token, 
                    {
                        onSuccess: function(result){
                            console.log(result);
                            window.location = result.finish_redirect_url;
                        },
                        onPending: function(result){
                            console.log(result);
                            window.location = result.pdf_url;
                        },
                        onError: function(result){
                            console.log(result);
                            // window.location = result.finish_redirect_url;
                            self.execSnapCont(snap_token);
                        },
                        onClose: function(){
                            // window.history.back();
                            console.log(result);
                            self.execSnapCont(snap_token);
                        }
                    });
                    snapExecuted = true; // if SNAP popup executed, change flag to stop the retry.
                } catch (e){ 
                    console.log(e);
                    console.log('Snap not ready yet... Retrying in 1000ms!');
                }
                if (snapExecuted) {
                    clearInterval(callbackTimer);
                }
            }, 1000);
  }*/

  ionViewDidLoad() {

    const filePath = 'SB-Mid-server-RvLnQ-6vW6kvvpOCgCpuu9RR:';
    const auth = btoa(filePath);
    const data = {
      "transaction_details": {
        "order_id": "ORDER-1292040921",
        "gross_amount": 10000
      }
    };
    //this.base64.encodeFile(filePath).then((base64File: string) => {
      let headers = new Headers({'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': 'Basic ' + auth});
      let options = new RequestOptions({ headers: headers });   
      return this.http.post(ENV.MIDTRANS_ENDPOINT + 'transactions', data, options)
      .map(res => res.json())
      .subscribe(data => {
        /*browserTab.isAvailable()
        .then(isAvailable => {
          if (isAvailable) {
            //browserTab.openUrl(data.redirect_url);
            this.loadExtScript('https://app.sandbox.midtrans.com/snap/snap.js');
            this.execSnapCont(data.token);
          } else {
            // open URL with InAppBrowser instead or SafariViewController
          }
        });*/
        this.win = window.open(data.redirect_url, '_blank', 'EnableViewPortScale=yes');
        this.win.addEventListener( "loadstop", function() {
        this.win.executeScript(
            { code: "document.body.innerHTML" },
            function( values ) {
                alert( values[ 0 ] );
            }
        );
});
        //this.loadExtScript('https://app.sandbox.midtrans.com/snap/snap.js');
            //this.execSnapCont(data.token);
      });
    /*}, (err) => {
      console.log(err);
    });*/
    
  }


}

import {Component} from '@angular/core';
import {NavController, ViewController, IonicPage} from 'ionic-angular';

@IonicPage({name: 'tab-filter'})  
@Component({
  selector: 'page-tab-filter',
  templateUrl: 'tab-filter.html'
})
export class TabFilterPage {
  // set filter value
  public filter: any;
  private data: any;

  constructor(public nav: NavController, public viewCtrl: ViewController) {
    this.filter = {
      to: 0,
      from: 0
    };
  }

  applyFilter() {
    this.data = {
      method: 'filter',
      value: this.filter
    };
    this.viewCtrl.dismiss(true, this.data);
  }

  clearFilter() {
    this.data = {
      method: 'clear',
      value: null
    };
    this.viewCtrl.dismiss(true, this.data);
  }

  priceRange(event, type) {
    this.filter[type] = event.target.value;
  }

  // close modal
  closeModal() {
    this.viewCtrl.dismiss(false);
  }
}

import {Component} from '@angular/core';
import {NavController, IonicPage} from 'ionic-angular';

@IonicPage({name: 'forgot-password'})
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {

  constructor(public nav: NavController) {
  }

  // submit email
  send() {
    // enter your code here
    // back to login page
    this.nav.setRoot('login');
  }
}
